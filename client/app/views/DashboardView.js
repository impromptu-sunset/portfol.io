// Backbone view for the dashboard
// Collection is Stocks
var DashboardView = Backbone.View.extend({

  className: 'dashboard container-fluid',

  initialize: function(params){
    // this.graphView = new GraphView({collection: this.collection});
    // this.infoView = new InfoView({collection: this.collection});


    this.wallet = new WalletModel();
    this.walletView = new WalletView({model: this.wallet});
    this.lifeEventsView = new LifeEventsView({collection: params.life_events, wallet: this.wallet});
    this.gameStocksView = new GameStocksView({collection: this.collection});

    this.render();

    this.collection.on('life_event', function(){
      this.lifeEventsView.addLifeEvent();
    }, this);

    // add or subtract money from wallet
    this.collection.on('buy sell', function() {
      // console.log('inside dashboardView buy/sell listener');
      var cost = this.collection.getValueDiff();
      if (cost > 0){
        this.walletView.model.buy(cost);
      } else {
        this.walletView.model.spend(cost);
      }
    }, this);
    
    // show value of investment
    this.collection.on('accrual', function (e) {
      console.log('inside dashboardView accrual listener');
      var total = this.collection.getValue();
      this.walletView.model.investmentValue(total);
      // this.walletView.model.updateInvestment(e.model);
    }, this);
   
  },

  setUsername: function(name) {
    this.infoView.setUsername(name);
  },

  render: function(){

    return this.$el.html([
      this.gameStocksView.$el,
      // this.graphView.$el,
      // this.infoView.$el,
      // add the wallet box div to the DOM on page load
      //
      // this is necessary because whenever there is a change, the entire page
      // re-renders. We want the cash value to re-render everytime the cash value
      // increases or decreases, so it is necessary to create a DOM element
      // for the wallet view to reference when it is re-rendering its value.
      '<div id="wallet-box">Wallet Box!</div>',
      // after we create the wallet-box div, then we can render the wallet view
      // which references the $el value and manages its own updating
      this.walletView.$el,
      this.lifeEventsView.$el

    ]);
    // this.delegateEvents();
    // this.bindListeners();
    // return html;
  },

  renderWallet: function() {
    this.walletView.render();
  }

});
