var ResultView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  className: 'col-xs-12 col-sm-6',

  template: _.template('<div class="result-status-title">' +
                      '<h4><%= status %></h4>' +
                      '</div>' +
                      '<div class="ebay-result>' +
                      '<div class="ebay-title"><h5><%= ebay.title[0] %></h5></div>' +
                      '<div class="ebay-image"><img src="<%= ebay.galleryURL %>" /></div>' +
                      '<div class="ebay-price"><h5>$<%= numeral(ebay.sellingStatus[0].currentPrice[0].__value__).format("0,0.00") %></h5>' +
                      '</div>' +
                       '<div class="random-item-result">' +
                       '<h5><%= numeral(randomItem.quantity).format("0,0") %> <%= randomItem.description %></h5>' +
                       '</div>'),

  render: function() {
    var resultStatus = this.model.get('status');
    console.log('RESULT STATUS IS', resultStatus);
    this.$el.empty();

    this.$el.addClass(resultStatus);

    return this.$el.html(this.template(this.model.attributes));
  }
});