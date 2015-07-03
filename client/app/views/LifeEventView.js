// Backbone view for stock information
var LifeEventView = Backbone.View.extend({

  className: 'life_event',

  template: _.template('<div class="info-item row well">\
                        <%= event %><br>\
                        <%=text%>: <%= value %>,\
                        </div>'),

  initialize: function(params) {
    this.wallet = params.wallet;
    // console.log(params);
  },

  render: function() {
    this.$el.empty();
    // if has percent, then amount is based on wallet.
    // need access to wallet.
    var value=null;
    var text = null;
    var toChange = null;
    var wallet_amount = this.wallet.get('cash');
    if(this.model.get('percent')){
      toChange = (this.model.get('percent')/100.0 * wallet_amount);
    } else{
      toChange = this.model.get('amount'); 
    }
    if(this.model.get('by') === 'neg'){
      text = "YOU LOST";
      value = wallet_amount - toChange;
    } else{
      text = "YOU WON";
      value = wallet_amount + toChange;
    }
    this.$el.html(this.template({
      "event": this.model.get('event'),
      "value": toChange,
      "text": text
    }));

    this.wallet.set('cash', value);
    
    return this.$el;  
  }

  

});


 // now when click button or something, want to randomly choose
      // a life event by probability, then render it (so maybe have a life event view
        // entry for the separate individual element)
      // so initially just render an empty div