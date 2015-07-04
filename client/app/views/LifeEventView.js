// Backbone view for stock information
var LifeEventView = Backbone.View.extend({

  className: 'life_event',

  template: _.template('<div class="info-item row well">\
                        <%= event %><br>\
                        <i class="glyphicon glyphicon-arrow-<% if \
                        (text === "YOU WON") { %>up up-icon<% } else \
                        { %>down down-icon<% } %>"></i>\
                        <%=text%>: <%= value %></div>'),

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
      this.model.trigger('updateTotal', Number("-"+toChange));
    } else{
      text = "YOU WON";
      value = wallet_amount + toChange;
      this.model.trigger('updateTotal', toChange);
    }
    this.$el.html(this.template({
      "event": this.model.get('event'),
      "value": toChange,
      "text": text
    }));

    if(value <= 0){
      value = 0;
    }
    this.wallet.set('cash', value);
    
    setTimeout(function(){
      this.$el.hide( "slow");
    }.bind(this), 3000);

    return this.$el;  
  }

  

});


 // now when click button or something, want to randomly choose
      // a life event by probability, then render it (so maybe have a life event view
        // entry for the separate individual element)
      // so initially just render an empty div