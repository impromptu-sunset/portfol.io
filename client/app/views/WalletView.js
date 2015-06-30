// Backbone view for the wallet
var WalletView = Backbone.View.extend({

  classname:'wallet col-xs-12 col-md-7',

  template: _.template('<button name="buy-button" class="btn"> \
                        <button name="sell-button" class="btn"> \ '),

  initialize: function() {
    this.$el.html('<p>hello</p>');
  },

  render: function (){

    return this.$el;
  }



});