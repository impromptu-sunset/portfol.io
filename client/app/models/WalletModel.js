// Backbone model for the user's wallet
var WalletModel = Backbone.Model.extend({

  defaults: {
    'cash': 10000,
    'investment': 0
  },

  initialize: function() {
    // console.log('wallet created');
    setInterval(this.accrual.bind(this), 300);
  },

  buy: function(moolah) {
    var dough = this.get('cash');
    this.set('cash', dough + moolah);
    this.trigger('buy');
  },

  spend: function(moolah) {
    var cheddar = this.get('cash');
    this.set('cash', cheddar - moolah);
    this.trigger('spend');
  },

  investmentValue: function(moolah) {
    var bread = this.get('investment');
    this.set('investment', moolah);
  },

  accrual: function() {
    this.trigger('accrue');
  },

  getCash: function() {
    return this.get('cash');
  }

});