// Backbone view for the dashboard
// Collection is Stocks
var DashboardView = Backbone.View.extend({

  className: 'dashboard container-fluid',

  initialize: function(params){
    this.lifeEvents = params.life_events;
    this.wallet = new WalletModel();
    this.walletView = new WalletView({model: this.wallet});
    this.lifeEventsView = new LifeEventsView({collection: this.lifeEvents, wallet: this.wallet});
    this.gameStocksView = new GameStocksView({collection: this.collection});
    this.resultsView = new ResultsView({collection: new ResultsCollection(), wallet: this.wallet});

    this.render();

    this.listenTo(this.collection, 'game_over', function(){
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

    this.generateStocks();

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
      // console.log('inside dashboardView accrual listener');
      var total = this.collection.getValue();
      this.walletView.model.investmentValue(total);
    }, this);

    this.listenTo(this.resultsView, 'readyToRenderResults', function() {
      this.$el.append(this.resultsView.render());
    });
   
  },

  setUsername: function(name) {
    this.infoView.setUsername(name);
  },

  // simplified version your max possible Return on Invesvent
  renderPotentialValue: function(){
    // don't need this anymore.
    var total_potential = this.collection.reduce(function(memo, num){
      return memo + Number(num.get('potential'));
    },0, this);


    var life_events_total = this.lifeEvents.total_life_events;

    var potential = total_potential + life_events_total;
    this.$('#potential').remove();
    this.$el.append('<div id="potential">Potential Value '+ potential+'</div>');

  },

  render: function(){

    return this.$el.html([
      this.gameStocksView.$el,
      this.walletView.$el,
      this.lifeEventsView.$el,
    ]);

  },

  renderWallet: function() {
    this.walletView.render();
  },

  renderResults: function() {
    this.gameStocksView.remove();
    this.walletView.remove();
    this.lifeEventsView.remove();
    this.resultsView.getResultItems();
  },

  showSpinner: function() {
    var context = this;
    this.$el.prepend('<div id="spinner"></div>')


    // must be wrapped in a set timeout function because of the time delay writing to the $el
    setTimeout(function() {
      var spinnerTarget = document.getElementById('spinner');
      context._spinner = new Spinner().spin(spinnerTarget);
    }, 1)
  },

  generateStocks: function() {
    var sampleStockDataA = {};
    var sampleStockA;
    var stock;
    var context = this;

    sampleStockDataA = {
      symbol: 'AIG',
      from: '2000-01-01', //FORMAT: 'YYYY-MM-DD',
      to: '2015-07-3',     //FORMAT: 'YYYY-MM-DD', Currently unnecessary because we always retrieve to the latest date
      amount: 1,
      period: 'd'          // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    };

    sampleStockDataB = {
      symbol: 'APC',
      from: '2000-01-01', //FORMAT: 'YYYY-MM-DD',
      to: '2015-07-3',     //FORMAT: 'YYYY-MM-DD', Currently unnecessary because we always retrieve to the latest date
      amount: 1,
      period: 'd'          // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    };

    sampleStockDataC = {
      symbol: 'OMX',
      from: '2000-01-01', //FORMAT: 'YYYY-MM-DD',
      to: '2015-07-3',     //FORMAT: 'YYYY-MM-DD', Currently unnecessary because we always retrieve to the latest date
      amount: 1,
      period: 'd'          // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    };

    // shows the loading spinner
    this.showSpinner()

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: '/api/stocks',
      data: JSON.stringify(sampleStockDataA),
      dataType: "json"
      })
      .done(function(data) {
        // store the results data
        var stockDataA = data;
        sampleStockA = new StockModel();

        $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/stocks',
        data: JSON.stringify(sampleStockDataB),
        dataType: "json"
        })
        .done(function(data) {
          var stockDataB = data;
          sampleStockB = new StockModel();
          
           $.ajax({
          type: "POST",
          contentType: "application/json",
          url: '/api/stocks',
          data: JSON.stringify(sampleStockDataC),
          dataType: "json"
          })
          .done(function(data) {
            var stockDataC = data;
            sampleStockC = new StockModel();

            sampleStockA.parse(stockDataA);
            context.collection.add(sampleStockA);

            sampleStockB.parse(stockDataB);
            context.collection.add(sampleStockB);

            sampleStockC.parse(stockDataC);
            context.collection.add(sampleStockC);
            // stops the loading spinner
            context._spinner.stop()

          });

        });

      });

  }

});
