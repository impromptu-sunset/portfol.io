// Backbone view for the wallet
var WalletView = Backbone.View.extend({

  classname:'wallet col-xs-12 col-md-7',

  // el: '#wallet-box',

  template: _.template('<button id="buy-button" class="btn btn-default">Buy</button> \
                        <button id="sell-button" class="btn btn-default">Sell</button> \
                        <h3>$<%= numeral(cash).format("0,0.00") %></h3> '),

  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
    // DEBUG VALUES BEFORE HOOKING UP WITH REAL STOCKS
    this.originalShares = 200;
    this.nShares = 200;
    this.adjClose = 5;
    this.magnitudeBuySell = 0.2;
  },

  events: {
    'click #buy-button': 'handleBuy',
    'click #sell-button': 'handleSell'
  },

  render: function (){
    this.$el.html(this.template(this.model.attributes));

  },

  handleBuy: function(event) {
    event.preventDefault();

    var nShares = this.nShares;
    var adjClose = this.adjClose;
    var currentCash = this.model.get('cash');

    // debugger;
    var numSharesToBuy = Math.round(this.originalShares * this.magnitudeBuySell);
    var cost = numSharesToBuy * adjClose;
    console.log('num shares to buy', numSharesToBuy);
    // console.log('you tried to buy!');

    if (currentCash - cost < 0) {
      console.error('ERROR: trying to spend more cash than you have');
      return;
    }
    this.model.set('cash', currentCash-cost);
    this.nShares = this.nShares + numSharesToBuy;
    console.log('new number of shares', this.nShares);

  },

  handleSell: function(event) {
      event.preventDefault();

    var nShares = this.nShares;
    var adjClose = this.adjClose;
    var currentCash = this.model.get('cash');

    // debugger;
    var numSharesToSell = Math.round(this.originalShares * this.magnitudeBuySell);

    var cost = numSharesToSell * adjClose;

    if (nShares - numSharesToSell < 0){
      console.error("ERROR: trying to sell more shares than you own");
      return;
    }
    console.log('num shares to sell', numSharesToSell);
    // console.log('you tried to buy!');

  
    this.model.set('cash', currentCash+cost);
    this.nShares = this.nShares - numSharesToSell;
    console.log('new number of shares', this.nShares);

  }



});