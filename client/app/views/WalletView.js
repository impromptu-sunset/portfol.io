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
    this.nShares = 200;
    this.adjClose = 5;
    this.magnitudeBuySell = .2;
  },

  events: {
    'click #buy-button': 'handleBuy',
    'click #sell-button': 'handleSell'
  },

  render: function (){
    console.log('trying to render wallet view');
    this.$el.html(this.template(this.model.attributes));

  },

  handleBuy: function(event) {
    event.preventDefault();

    var nShares = this.nShares;
    var adjClose = this.adjClose;
    var currentCash = this.model.get('cash');

    // debugger;
    var numSharesToBuy = nShares * this.magnitudeBuySell;
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

    // console.log('you tried to sell!');

    var currentCash = this.model.get('cash');

    this.model.set('cash', currentCash+5);
    console.log(this.model.get('cash'));

  }



});