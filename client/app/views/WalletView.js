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

    var nShares = 100;
    var adjClose = 2;

    // console.log('you tried to buy!');
    var currentCash = this.model.get('cash');

    this.model.set('cash', currentCash+5);
    console.log(this.model.get('cash'));
  },

  handleSell: function(event) {
    event.preventDefault();

    // console.log('you tried to sell!');

    var currentCash = this.model.get('cash');

    this.model.set('cash', currentCash-5);
    console.log(this.model.get('cash'));

  }



});