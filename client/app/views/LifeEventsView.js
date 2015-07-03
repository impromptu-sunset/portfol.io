// Backbone view for stock information
var LifeEventsView = Backbone.View.extend({

  className: 'life_events',

  template: _.template('<div class="info-item row"></div>'),

  initialize: function(params) {
    this.collection.on('sync', this.render, this);
    this.wallet = params.wallet;
    console.log("WALLET IS", this.wallet);
    this.wallet.on('change', function(){
      console.log("wallet changed");
    });
  },

  render: function() {
    this.$el.empty();
    //this.$el.html(this.template());
    //this.addLifeEvent();
  },

  addLifeEvent: function(){
    // choose a Random life event, but based on probability..
    var current_event = this.collection.pick_event();
    this.$el.empty();
    this.$el.append([
      new LifeEventView({model: current_event, wallet_amount: this.wallet.get('cash')}).render()
    ]);
  }

});


 // now when click button or something, want to randomly choose
      // a life event by probability, then render it (so maybe have a life event view
        // entry for the separate individual element)
      // so initially just render an empty div