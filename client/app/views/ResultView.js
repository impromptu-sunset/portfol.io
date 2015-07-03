var ResultView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  template: _.template('<h5><%= ebay.title[0] %></h5><img src="<%= ebay.galleryURL %>" />' +
                       '<h5><%= randomItem.quantity %> <%= randomItem.description %>'),

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }
});