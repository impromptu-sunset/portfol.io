var ResultView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  render: function(){
    console.log('trying to render result view');
    console.log('result view model', this.model);
    this.$el.html('<p>hello from result view</p>')
    // return this.$el.html(this.template(this.model.attributes));
  }
});