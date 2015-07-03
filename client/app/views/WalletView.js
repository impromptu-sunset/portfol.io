// Backbone view for the wallet
var WalletView = Backbone.View.extend({

  classname:'wallet col-xs-12 col-md-7',

  // el: '#wallet-box',

  template: _.template('<h3>$<%= numeral(cash).format("0,0.00") %></h3><h3>$<%= numeral(investment).format("0,0.00") %></h3>'),

  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  render: function (){
    this.$el.empty();
    this.$el.append(this.template(this.model.attributes));
  }

});