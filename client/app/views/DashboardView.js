// Backbone view for the dashboard
var DashboardView = Backbone.View.extend({

  className: 'dashboard container-fluid',

  initialize: function(){
    // this.graphView = new GraphView({collection: this.collection});
    this.gameStockView = new GameStockView({collection: this.collection});
    this.infoView = new InfoView({collection: this.collection});
    this.walletView = new WalletView({model: new WalletModel()});
    this.collection.on('add reset', function() {
      this.render();
    }, this);
  },

  setUsername: function(name) {
    this.infoView.setUsername(name);
  },

  render: function(){
    return this.$el.html([
      this.gameStockView.$el,
      this.graphView.$el,
      this.infoView.$el,
      this.walletView.$el
    ]);
  }

});
