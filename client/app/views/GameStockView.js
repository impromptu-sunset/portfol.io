/* Backbone view for the graph view
find more information on mbostock's page for charting line charts: http://bl.ocks.org/mbostock/3883245 */

var GameStockView = Backbone.View.extend({

  className: 'graph col-xs-4 col-md-4',

  template: _.template('<button id="buy-button" class="btn btn-default">Buy</button> \
                        <button id="sell-button" class="btn btn-default">Sell</button>'
                        ),

  initialize: function() {
    // this.model.on('remove reset', this.render, this);
    var context = this;
    $(window).on("resize", function() {
      context.render.apply(context);
    });
    // this.render();
  },

  // creates an array of data (of length sampleSize)
  getStockData: function() {

    // number of samples in the data array
    var sampleSize = 365;

    var rawData = this.model.getTrajectory();
    if (rawData.length <= sampleSize) {
      return rawData;
    } else {
      var result = [], increment = rawData.length / sampleSize;
      for (var i = 0; i < rawData.length; i += increment) {
        var index = Math.floor(i);
        result.push(rawData[index]);
        // if (results.length === sampleSize) return results;
      }
      return result;
    }
  },

  drawStockLine: function() {

    var context = this;

    // time to each new data point, in ms
    var clockSpeed = 300;

    // array of data for one stock in the collection
    var stockData = this.getStockData();
    console.log("stock data is: ", stockData);

    // number of data points to show at a time
    var n = 10;
    
    // first n points of data
    var data = stockData.splice(0, n);

    var margin = {top: 20, right: 20, bottom: 20, left: 50},
        width = this.$el.width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]).nice(d3.time.year, 1);

    // var x = d3.scale.linear()
    //     .domain([0, n - 1])
    //     .range([0, width]);

    //y-axis scaled in standard linear format ($ values)
    var y = d3.scale.linear()
        .range([height, 0]);
        // .nice();

    var yAxis = d3.svg.axis().scale(y).orient("left");

    //set y-domain to min and max stock $ ranges
    y.domain([
       d3.min(data, function(d) { return d.value; }),
       d3.max(data, function(d) { return d.value; })
     ]);

    var stockScale = data[0].adjClose;
    // line generation function
    var line = d3.svg.line()

        .x(function(d, i) { return x(d.date); })
        .y(function(d, i) { return y(d.value); });

    // append svg and axes to graph container

    var svg = d3.select(this.el).insert("svg",":first-child")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
        //.attr('transform','translate(0,' + height / 2 + ')');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.svg.axis().scale(x).orient("bottom").ticks(1));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    var path = svg.append("g")
        .attr('class', 'path')
        .attr("clip-path", "url(#clip)")
      .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var price = d3.select(this.el).append("g")
      .attr('transform', 'translate(' + (width + margin.left + margin.right) * 0.6 + ', 0)')
      .append('rect')
        .attr("width", (width + margin.left + margin.right) * 0.4)
        .attr("height", 30);

    var text =  price.append('text')
          .attr('x', (width + margin.left + margin.right) * 0.6)
          .attr('y', 30)
          .attr('dy', '28px');

    var tick = function() {
        //update domain


        if(stockData.length===0){
          console.log("LAST ITEM ", data[data.length - 1]);

          //this was changed on merge!!!!!!
          context.model.trigger("game_over");
          return;
        }
        data.push(stockData.shift());
        var middle = data[data.length - 1].value;

        
        text
          .text('Value: $' + numeral(context.model.getGameValue()).format("0,0.00"));

        context.model.setAdjClose(data[data.length - 1].adjClose);
        
        path
        .attr("d",line)
        .attr("transform", null);
        
        y.domain([middle - stockScale, middle + stockScale]);
        x.domain([
          d3.min(data, function(d) { return d.date; }), 
          d3.max(data, function(d) { return d.date; })
        ]);
       
        yAxis = d3.svg.axis().scale(y).orient("left");
        xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(1);

        //switch to new scale
        svg.select(".y.axis")
        .transition()
        .duration(clockSpeed)
        .ease("linear")
        .call(yAxis);

        svg.select(".x.axis")
        .transition()
        .duration(clockSpeed)
        .ease("linear")
        .call(xAxis);
          
          // update the line
        path
        .transition()
        .duration(clockSpeed)
        .ease("linear")
        .attr("d", line)
        .attr("transform", "translate(0,0)")
        .each('end', function(){
          // pop the old data point off the front
          
          data.shift();
          context.model.trigger('accrual', context);
          tick(data);
          //updateY(data);
        });    

    };

    tick();

  },


  // controller

  events: {
    'click #buy-button': 'handleBuy',
    'click #sell-button': 'handleSell'
  },
  
  magnitudeBuySell : 0.2,

  handleBuy: function(event) {
    event.preventDefault();
    // console.log('trying to buy');

    var originalShares = this.model.getStartShares();
    var nShares = this.model.getNShares();

    this.model.setNShares(nShares + (originalShares * this.magnitudeBuySell));

    this.model.trigger('buy');

    // this.delegateEvents();
 
  },

  handleSell: function(event) {
    event.preventDefault();

    var originalShares = this.model.getStartShares();
    var nShares = this.model.getNShares();

    var numSold = nShares - (originalShares * this.magnitudeBuySell);

    if (numSold > 0) {
      this.model.setNShares(numSold);
    } else {
      this.model.setNShares(0);
    }

    this.model.trigger('sell');

    // this.delegateEvents();

  },

  render: function() {
    console.log('rendering gameStockView');
    // this.$el.empty();
    return this.$el.html(this.template(this.model.attribtes));
    // '<button id="buy-button" class="btn btn-default">Buy</button> \
    //                 <button id="sell-button" class="btn btn-default">Sell</button>');
    // this.delegateEvents();
    // return this.$el;
  }

});
