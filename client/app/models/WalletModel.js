// Backbone model for the user's wallet
var WalletModel = Backbone.Model.extend({

  defaults: {
    'cash': 0
  },

  initialize: function() {
    console.log('hello I am the wallet model!');
  }
});