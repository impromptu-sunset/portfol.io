/* Backbone view for the graph view
find more information on mbostock's page for charting line charts: http://bl.ocks.org/mbostock/3883245 */

var GameStockView = Backbone.View.extend({

  className: 'graph col-xs-4 col-md-4',

  initialize: function() {
    this.model.on('sync edited remove reset', this.render, this);
    var context = this;
    $(window).on("resize", function() {
      context.render.apply(context);
    });
    //this.render();
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

    // time to each new data point, in ms
    var clockSpeed = 300;

    // array of data for one stock in the collection
    var stockData = this.getStockData();
    console.log("stock data is: ", stockData);

    // number of data points to show at a time
    var n = 10;
    
    // first n points of data
    var data = stockData.splice(0, n);

    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = this.$el.width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, n - 1])
        .range([0, width]);

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

    // line generation function
    var line = d3.svg.line()
        //.interpolate("monotone")
        .x(function(d, i) { return x(i); })
        .y(function(d, i) { return y(d.value); })
        //.interpolate("basis");

    // append svg and axes to graph container
    var svg = d3.select(this.el).append("svg")
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
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));

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

    var updateY = function(data){
         //update domain
         data.push(stockData.shift());
          var middle = data[data.length - 1].value;
          
          
          path
          .attr("d",line)
          .attr("transform", null);
          
          y.domain([middle - 500, middle + 500]);
          // y.domain([
          //   d3.min(data, function(d) { return d.value; }),
          //   d3.max(data, function(d) { return d.value; })
          // ]); 
          //change scale
          //yScale.domain(yDomain); 
          yAxis = d3.svg.axis().scale(y).orient("left");
          //switch to new scale
          svg.select(".y.axis")
          .transition()
          .duration(clockSpeed)
          .ease("linear")
          .call(yAxis);
            
            // update the line
          path
          .transition()
          .duration(clockSpeed)
          .ease("linear")
          .attr("d", line)
          .attr("transform", "translate(" + x(-1) + ",0)")
          .each('end', function(){
            // pop the old data point off the front
            
            data.shift();
            updateY(data);
            //updateY(data);
          });   
           
    }
    var tick = function() {

      // push a new data point onto the back
      data.push(stockData.shift());

      
      //var middle = data[data.length - 1].value;
      //y.domain([middle - 500, middle + 500]);
      //  y.domain([
      //   d3.min(data, function(d) { return d.value; }),
      //   d3.max(data, function(d) { return d.value; })
      // ]);
      //yAxis = d3.svg.axis().scale(y).orient("left");
      // redraw the line, and slide it to the left

      // var middle = data[data.length - 2].value - data[data.length - 1].value;
      // d3.select('.y.axis')        
      //   .transition()
      //     .duration(clockSpeed)
      //     .ease("linear")
      //     .attr('transform', 'translate(0, ' + y(middle) + ')');
      // svg.select('.line')
        // .attr("d", line)
        // .attr("transform", null);

      // var t = svg
      //   .transition()
      //   .duration(clockSpeed);

       // t.select(".y.axis")
       //   .call(yAxis);

      path
          //.transition()
          //.duration(clockSpeed)
          .attr("d", line)
          .attr("transform", null)
          .transition()
          .duration(clockSpeed)
          //.duration(clockSpeed)
          .ease("linear")
          //.transition()
          //.duration(clockSpeed)
          .attr("transform", "translate(" + x(-1) + ",0)")
          //.attr("transform", "translate(0,0)")
          .each('end', function(){
            // pop the old data point off the front
            
            data.shift();
            //tick();
            updateY(data);            
          });
    };

    tick();

  },

  render: function() {
    this.$el.empty(); 
    //this.drawStockLine();
    return this.$el;
  }

});
