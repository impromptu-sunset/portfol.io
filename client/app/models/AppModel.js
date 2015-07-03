// Backbone model for the app
var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.set('signedin', false);
    this.set('username', null);
    this.setupLifeEvents();
  },

  setupLifeEvents: function(){
    var life_events = new LifeEvents();
    life_events.fetch();
    console.log(life_events);
    this.set('life_events', life_events);
  }


  
});
