// Backbone view for the wallet
var WalletView = Backbone.View.extend({

  className:'wallet',

  // el: '#wallet-box',

  template: _.template('<h3>Cash Available: $<%= numeral(cash).format("0,0.00") %></h3> \
                        <h3>Portfolio Value: $<%= numeral(investment).format("0,0.00") %></h3> \
                        '),

  initialize: function() {
    this.listenTo(this.model, 'buy sell accrue', this.render);
    this.render();
  },

  render: function (){
    this.$el.empty();
    this.$el.append(this.template(this.model.attributes));
  }

});