/* Backbone view for the graph view
find more information on mbostock's page for charting line charts: http://bl.ocks.org/mbostock/3883245 */

var GameStocksView = Backbone.View.extend({

  className: 'graphs col-xs-12 col-md-12',

  initialize: function() {
    // this.collection.on('sync', this.render, this);
    this.listenTo(this.collection, 'sync add', this.render);
    this.collection.on('game_over', this.reset_timeout, this);
    var context = this;
    $(window).on("resize", function() {
      context.collection.trigger('resize');
    });
  },

  reset_timeout: function(){
    clearTimeout(this.timeout);
    // console.log("OVER!");
    // console.log("FINAL COLLECTION ",this.collection);
  },

  render: function() {
    // stop listening.
    this.$el.hide();
    this.$el.empty();
    if (this.collection.length > 0) {  
      this.$el.show();
      this.collection.forEach(function(model){
        var gameStockView = new GameStockView({model: model});
        gameStockView.listenTo(this, 'resize', gameStockView.remove)
        this.$el.append(gameStockView.render());
        gameStockView.drawStockLine();
      }, this);

      clearTimeout(this.timeout);
      this.setup_timer();
      return this.$el;
    }
  },

  setup_timer :function(){
    // random number from 1 second to 10 seconds.
    var random = Math.floor(Math.random() * 12000) + 4000; 
    this.timeout = setTimeout(function(){
      this.collection.trigger('life_event');
      // console.log(random);
      this.setup_timer();
    }.bind(this), random);
  }

});
