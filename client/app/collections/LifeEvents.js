// Backbone Collection for Life Events
var LifeEvents = Backbone.Collection.extend({

  model: LifeEventModel,
  url: '/data/life_events',
  total_life_events: 0,
  
  initialize: function(){
    this.on('updateTotal', function(change){
      // console.log("CHANGE IS ", change);
      if(change){
        this.total_life_events += Number(change);
      }
    });
  },
  parse: function(data){
    // called when we call fetch on collection
    // want to calculate probability of each
    var previous_probability = 0;
    data.forEach(function(item, index){
      item.start = previous_probability;
      item.end = item.start + item.probability;
      previous_probability = item.end;
    });
    this.total_probability = data[data.length - 1].end;
    return data;
  },

  pick_event: function(){
    var index = Math.random()* this.total_probability;
    var found = null;
    this.forEach(function(item, i){
      if(item.get('start') <= index && item.get('end') >= index){
        found = item;    
      }
    }, this);
    return found;
  },



});