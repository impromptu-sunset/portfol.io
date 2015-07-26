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

  generateRandomPotentialCash: function(earned) {
    earned = earned || 2;
    return Math.floor(Math.random() * (2000000 - (earned+5000))) + (earned+5000);
  },

  showSpinner: function() {
    var context = this;
    // must be wrapped in a set timeout function because of the time delay writing to the $el
    setTimeout(function() {
      var spinnerTarget = document.getElementById('spinner');
      context._spinner = new Spinner().spin(spinnerTarget);
      $('#loading-message').html('<h1>Generating your results...</h1>')
      $('#loading-message').show()
    }, 1)
  },

  stopSpinner: function() {
    this._spinner.stop()
    $('#loading-message').hide()
  },

  getPurchaseResult: function(earned, potential) {
    var context = this;
    var earnedCash = earned || 2;
    var potentialCash = potential || 86210;
    var earnedResultObj = {};
    var potentialResultObj = {};

    // if the game has already ended, and this function was called again
    if (this.gameHasEnded) {
      // eject to not display extra results
      return;
    }
    this.gameHasEnded = true
    this.showSpinner()

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
        earnedResultObj.ebay = data._ebay;
        earnedResultObj.randomItem = data._randomItem;
        earnedResultObj.status = "earned";
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
            potentialResultObj.ebay = data._ebay;
            potentialResultObj.randomItem = data._randomItem;
            potentialResultObj.status = "potential";
            // add a new model to the collection with the results
            context.collection.add([earnedResultObj, potentialResultObj]);

            context.trigger('readyToRenderResults');
            context.stopSpinner()
            context.gameHasEnded = true;
          });
      });

  
  }
});