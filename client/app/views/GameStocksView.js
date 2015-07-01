/* Backbone view for the graph view
find more information on mbostock's page for charting line charts: http://bl.ocks.org/mbostock/3883245 */

var GameStockView = Backbone.View.extend({

  className: 'graph col-xs-12 col-md-12',

  initialize: function() {
    this.collection.on('sync edited remove reset', this.render, this);
    var context = this;
    $(window).on("resize", function() {
      context.render.apply(context);
    });
  },

  drawStocks: function() {

    this.collection.forEach(function(model){

    });

    var tick = function() {

      // push a new data point onto the back
      data.push(stockData.shift());

      // redraw the line, and slide it to the left
      d3.selectAll('.line')
          .attr("d", line)
          .attr("transform", null)
        .transition()
          .duration(clockSpeed)
          .ease("linear")
          .attr("transform", "translate(" + x(-1) + ",0)")
          .each('end', function(){
            // pop the old data point off the front
            data.shift();
            tick();
          });
    };

    tick();

  },

  render: function() {
    this.$el.hide();
    this.$el.empty();
    if (this.collection.length > 0) {  
      this.$el.show();
      this.drawStocks(this);
      return this.$el;
    }
  }

});
