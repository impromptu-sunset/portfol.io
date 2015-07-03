/* Backbone view for the graph view
find more information on mbostock's page for charting line charts: http://bl.ocks.org/mbostock/3883245 */

var GameStocksView = Backbone.View.extend({

  className: 'graphs col-xs-12 col-md-12',

  initialize: function() {
    this.collection.on('sync edited remove reset', this.render, this);
    this.collection.on('game_over', this.reset_timeout, this);
    var context = this;
    $(window).on("resize", function() {
      context.render.apply(context);
    });
  },

  reset_timeout: function(){
    clearTimeout(this.timeout);
    console.log("OVER!");
  },
  
  render: function() {
    console.log('inside gameStocksView render');
    this.$el.hide();
    this.$el.empty();
    if (this.collection.length > 0) {  
      this.$el.show();
      this.collection.forEach(function(model){
        var gameStockView = new GameStockView({model: model});
        this.$el.append(gameStockView.render());
        gameStockView.drawStockLine();
      }, this);
      // this.drawStocks(this);
      clearTimeout(this.timeout);
      this.setup_timer();
      return this.$el;
    }
  },

  setup_timer :function(){
    // random number from 1 second to 10 seconds.
    var random = Math.floor(Math.random() * 10000) + 1000; 
    this.timeout = setTimeout(function(){
      this.collection.trigger('life_event');
      console.log(random);
      this.setup_timer();
    }.bind(this), random)
  }

});
