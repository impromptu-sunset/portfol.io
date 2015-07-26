var ResultsView = Backbone.View.extend({
  initialize: function(params) {

    this.wallet = params.wallet;

    this.collection.on('add', function() {
    }, this);

    this.gameHasEnded = false;
    // DEBUG: this function gets the values for the earned and potential cash value
  },

  render: function(){
    var context = this;
    // add the earned and potential results to the DOM
    return this.$el.html('<h3>Results</h3>').append(
      this.collection.map(function(result) {
        return new ResultView({model: result, wallet: context.wallet}).render();
      })
    );
  },

  getResultItems: function() {
    var earned = parseInt(this.wallet.get('cash')+this.wallet.get('investment'));
    var potential = this.generateRandomPotentialCash(earned)
    this.getPurchaseResult(earned, potential);
  },

  className: 'results-box col-xs-12',

  generateRandomPotentialCash: function() {
    return Math.floor(Math.random() * (2000000 - 90000)) + 90000
  },

  getPurchaseResult: function(earned, potential) {
    var context = this;
    var earnedCash = earned || 2;
    var potentialCash = potential || 86210;
    var resultObj = {};

    if (this.gameHasEnded === true) {
      return;
    }

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
            context.trigger('readyToRenderResults');
            context.gameHasEnded = true;
          });
      });

  
  }
});