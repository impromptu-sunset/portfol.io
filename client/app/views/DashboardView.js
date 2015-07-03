// Backbone view for the dashboard
// Collection is Stocks
var DashboardView = Backbone.View.extend({

  className: 'dashboard container-fluid',

  initialize: function(params){
    // this.graphView = new GraphView({collection: this.collection});
    // this.infoView = new InfoView({collection: this.collection});

    this.lifeEvents = params.life_events;
    this.wallet = new WalletModel();
    this.walletView = new WalletView({model: this.wallet});
    this.lifeEventsView = new LifeEventsView({collection: this.lifeEvents, wallet: this.wallet});
    this.gameStocksView = new GameStocksView({collection: this.collection});
    this.resultsView = new ResultsView({collection: new ResultsCollection()});

    this.render();

    this.listenTo(this.collection, 'game_over', function(){
      this.renderPotentialValue();
      console.log('GAME HAS ENDED');
      this.renderResults();
    }, this);

    this.listenTo(this.collection, 'life_event', function(){
      this.lifeEventsView.addLifeEvent();
    });

    this.listenTo(this.collection, 'resize', function() {
      this.wallet.destroy();
      this.walletView.remove();
      this.gameStocksView.remove();
      this.remove();
    });

    // buy stock, subtract money from wallet
    this.listenTo(this.collection, 'buy', function (stock) {
      // console.log('inside dashboardView buy/sell listener');
      console.log(stock);

      // if user is broke, return without buying
      if (this.walletView.model.getCash() === 0) return;

      // amount of cash in wallet
      var skrill = this.walletView.model.getCash();

      var magnitudeBuySell = 0.2;
      var originalShares = stock.getStartShares();
      
      // number of stocks to buy, based on original stock value
      var numStocksToBuy = originalShares * magnitudeBuySell;
      
      // dollar cost of stocks given stock's current adjClose value
      var cost = numStocksToBuy * stock.getAdjClose();
      
      // if you have less money than the standard buy amount, spend remaining money
      // on however many shares you can afford
      if (cost > skrill) {
        numStocksToBuy = skrill / stock.getAdjClose();
        cost = skrill;
      }

      stock.buyAmount(numStocksToBuy);
      this.walletView.model.spend(cost);

    }, this);

    // sell stock, add money to wallet
    this.listenTo(this.collection, 'sell', function () {
      var cost = this.collection.getValueDiff();
      this.walletView.model.buy(cost);
    }, this);
    
    // show value of investment
    this.listenTo(this.collection, 'accrual', function (model) {
      console.log('inside dashboardView accrual listener');
      var total = this.collection.getValue();
      this.walletView.model.investmentValue(total);
    }, this);
   
  },

  setUsername: function(name) {
    this.infoView.setUsername(name);
  },

  // simplified version your max possible Return on Invesvent
  renderPotentialValue: function(){
    // don't need this anymore.
    var total_potential = this.collection.reduce(function(memo, num){
      console.log("memo", memo);
      console.log("num", num);
      return memo + Number(num.get('potential'));
    },0, this);

    console.log("total potential ", total_potential);

    var life_events_total = this.lifeEvents.total_life_events;

    console.log("total life ", life_events_total);

    var potential = total_potential + life_events_total;
    this.$('#potential').remove();
    this.$el.append('<div id="potential">Potential Value '+ potential+'</div>');

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
      // '<div id="wallet-box">Wallet Box!</div>',
      // after we create the wallet-box div, then we can render the wallet view
      // which references the $el value and manages its own updating
      this.walletView.$el,
      this.lifeEventsView.$el,
      // this.resultsView.$el
    ]);
    // this.delegateEvents();
    // this.bindListeners();
    // return html;
  },

  renderWallet: function() {
    this.walletView.render();
  },

  renderResults: function() {
    this.gameStocksView.remove();
    this.walletView.remove();
    this.lifeEventsView.remove();
    this.$el.append(this.resultsView.render());
  },

  generateStocks: function() {
    var sampleStockDataA = {};
    var sampleStockA;

    sampleStockA = {
      symbol: 'AAPL',
      from: '2000-01-01', //FORMAT: 'YYYY-MM-DD',
      to: '2015-07-3',     //FORMAT: 'YYYY-MM-DD', Currently unnecessary because we always retrieve to the latest date
      period: 'd'          // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    };

    sampleStockA = this.collection.model.fetch({data: sampleStockA, type: 'POST'});
  }

});
