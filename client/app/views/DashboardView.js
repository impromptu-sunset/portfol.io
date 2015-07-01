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
    // this.renderWallet();
  },

  setUsername: function(name) {
    this.infoView.setUsername(name);
  },

  render: function(){

    return this.$el.html([
      this.gameStockView.$el,
      // this.graphView.$el,
      this.infoView.$el,
      // add the wallet box div to the DOM on page load
      //
      // this is necessary because whenever there is a change, the entire page
      // re-renders. We want the cash value to re-render everytime the cash value
      // increases or decreases, so it is necessary to create a DOM element
      // for the wallet view to reference when it is re-rendering its value.
      '<div id="wallet-box">hello from the render dashboard view</div>',
      // after we create the wallet-box div, then we can render the wallet view
      // which references the $el value and manages its own updating
      this.walletView.$el,
    ]);
  },

  renderWallet: function() {
    // this.walletView.render();
  }

});
