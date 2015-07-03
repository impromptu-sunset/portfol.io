// Backbone view for stock information
var LifeEventView = Backbone.View.extend({

  className: 'life_event',

  template: _.template('<div class="info-item row">\
                EVENT: <%= event %>, AMOUNT: <%= value %>,\
                </div>'),

  initialize: function(params) {
    this.wallet = params.wallet_amount;
    console.log(params);
  },

  render: function() {
    this.$el.empty();
    // if has percent, then amount is based on wallet.
    // need access to wallet.
    var value=null;
    if(this.model.get('percent')){
      value = this.wallet;
    } else{
      value = this.model.get('amount');
    }
    console.log(this.model.attributes);
    this.$el.html(this.template({
      "event": this.model.get('event'),
      "value": value
    }));
    return this.$el;  
  }

  

});


 // now when click button or something, want to randomly choose
      // a life event by probability, then render it (so maybe have a life event view
        // entry for the separate individual element)
      // so initially just render an empty div