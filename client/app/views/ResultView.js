var ResultView = Backbone.View.extend({
  initialize: function(params){
    this.wallet = params.wallet;
    var combined  = params.wallet.get('cash') + params.wallet.get('investment');

    var status = this.model.get('status');
    if (status === 'earned') {
      this.model.set('cash', combined);
      this.model.set('header', 'You earned $' + numeral(combined).format("0,0"));
    } else {
      this.model.set('header', 'You could have earned...');
    }

    this.render();
  },

  className: 'col-xs-12 col-sm-6',

  template: _.template('<div class="result-status-title">' +
                      // '<h4><%= status %><%= cash %></h4>' +
                      '<h4><%= header %></h4>' +

                      '</div>' +
                      '<div class="ebay-result>' +
                      '<div class="ebay-title"><h5><%= ebay.title[0] %></h5></div>' +
                      '<div class="ebay-image"><img src="<%= ebay.galleryURL %>" /></div>' +
                      '<div class="ebay-price"><h5>$<%= numeral(ebay.sellingStatus[0].currentPrice[0].__value__).format("0,0.00") %></h5>' +
                      '</div>' +
                       '<div class="random-item-result well">' +
                       '<h5>You can also buy...</h5>' +

                       '<h5><%= numeral(randomItem.quantity).format("0,0") %> <%= randomItem.description %></h5>' +
                       '</div>'),

  render: function() {
    var resultStatus = this.model.get('status');
    this.$el.empty();

    this.$el.addClass(resultStatus);

    // console.log(this.wallet);

    return this.$el.html(this.template(this.model.attributes));
  }
});