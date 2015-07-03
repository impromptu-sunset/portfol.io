var ResultsView = Backbone.View.extend({
  initialize: function() {
    console.log('made the results view');
    this.render();
    console.log('result collection is', this.collection);
    this.collection.on('add', function() {
      console.log('result model changed');
    }, this);
    this.collection.add({result1: 'hello from collection'});
  },

  render: function(){
    this.$el.html('<p>hello from results render</p>');
  },

  getPurchaseResult: function() {
    var earnedCash = 8237;
    var potentialCash = 923827;

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: '/api/ebay',
      data: { cost: earnedCash },
      dataType: "json"
      })
      .done(function(data) {
        this.model.set('ebayResult', data.ebayResult);
        this.model.set('randomResult', data.)
      });
  }
});