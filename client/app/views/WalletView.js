// Backbone view for the wallet
var WalletView = Backbone.View.extend({

  classname:'wallet col-xs-12 col-md-7',

  template: _.template('<button id="buy-button" class="btn btn-default">Buy</button> \
                        <button id="sell-button" class="btn btn-default">Sell</button> \ '),

  initialize: function() {
    this.$el.html('<p>hello</p>');
    this.$el.append(this.template(this.model.attributes));
    console.log(this.model);
  },

  events: {
    'click #buy-button': 'handleBuy',
    'click #sell-button': 'handleSell'
  },

  render: function (){

    return this.$el;
  },

  handleBuy: function() {
    console.log('you tried to buy!');
    var currentCash = this.model.get('cash');

    this.model.set('cash', currentCash+5);
    console.log(this.model.get('cash'));
  },

  handleSell: function() {
    console.log('you tried to sell!');

    var currentCash = this.model.get('cash');

    this.model.set('cash', currentCash-5);
    console.log(this.model.get('cash'));

  }



});