var ResultsView = Backbone.View.extend({
  initialize: function() {
    this.render();

    this.collection.on('add', function() {
      this.render();
    }, this);
    // DEBUG: this function gets the values for the earned and potential cash value
    this.getPurchaseResult();
  },

  render: function(){
    // add the earned and potential results to the DOM
    return this.$el.html('<h3>Results</h3>').append(
      this.collection.map(function(result) {
        return new ResultView({model: result}).render();
      })
    );
  },

  className: 'results-box col-xs-12',

  getPurchaseResult: function(earned, potential) {
    var context = this;
    var earnedCash = earned || 17;
    var potentialCash = potential || 33772;

    // make an ajax call with the earned cash
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: '/api/ebay',
      data: JSON.stringify({ cost: earnedCash }),
      dataType: "json"
      })
      .done(function(data) {
        // store the results data
        resultObj.ebay = data._ebay;
        resultObj.randomItem = data._randomItem;
        resultObj.status = "earned";
        // add a new model to the collection with the results
        context.collection.add([resultObj]);
        // make an ajax call with the potential cash
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: '/api/ebay',
          data: JSON.stringify({ cost: potentialCash, status: 'potential' }),
          dataType: "json"
          })
          .done(function(data) {
            // store the results data
            resultObj.ebay = data._ebay;
            resultObj.randomItem = data._randomItem;
            resultObj.status = "potential";
            // add a new model to the collection with the results
            context.collection.add([resultObj]);
          });
      });

  
  }
});