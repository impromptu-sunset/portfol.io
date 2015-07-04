var ResultsView = Backbone.View.extend({
  initialize: function(params) {
    // this.render();
    console.log("PARAMS", params.wallet);

    this.wallet = params.wallet;
    console.log('params wallet', params.wallet);

    this.collection.on('add', function() {
      // this.render();
    }, this);
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
    var potential = (earned + 5)* 2.3;
    this.getPurchaseResult(earned, potential);
  },

  className: 'results-box col-xs-12',

  getPurchaseResult: function(earned, potential) {
    var context = this;
    var earnedCash = earned || 17;
    var potentialCash = potential || 33772;
    var resultObj = {};

    console.log('EARNED', earned, 'POTENTIAL', potential);

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
          });
      });

  
  }
});