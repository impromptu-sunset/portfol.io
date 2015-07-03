var ResultsView = Backbone.View.extend({
  initialize: function() {
    console.log('made the results view');
    this.render();

    console.log('result collection is', this.collection);

    this.collection.on('add', function() {
      console.log('result model changed');
      this.render();
    }, this);

    // this.collection.add({result1: 'hello from collection'});
    this.getPurchaseResult();
  },

  render: function(){
    // this.$el.html('<p>hello from results render</p>');
    // this.$el.children.detach();

    return this.$el.html('<h3>Results</h3>').append(
      this.collection.map(function(result) {
        console.log('TRYING TO APPEND', result);
        return new ResultView({model: result}).render();
      })
    );
  },

  className: 'results-box',

  getPurchaseResult: function() {
    var context = this;
    var earnedCash = 8237;
    var potentialCash = 923827;
    var resultObj = {};

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: '/api/ebay',
      data: JSON.stringify({ cost: earnedCash }),
      dataType: "json"
      })
      .done(function(data) {
        resultObj.ebay = data._ebay;
        resultObj.randomItem = data._randomItem;
        context.collection.add([resultObj]);


        // context.model.set('ebayResult', data._ebay);
        // context.model.set('randomResult', data._randomItem);
        // console.log('model attributes', context.model.attributes);
      });
  }
});