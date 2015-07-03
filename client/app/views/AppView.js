// Backbone view for the entire app
var AppView = Backbone.View.extend({

  el:'#main',

  navDiv: '<nav class="navbar navbar-inverse navbar-static-top"> \
             <div class="container-fluid"> \
               <a href="#front" class="navbar-brand">Portfol.io</a> \
               <ul class="nav nav-pills navbar-nav navbar-right"> \
                 <li><a href="https://github.com/impromptu-sunset/sandworm-hr">Github</a></li> \
               </ul> \
             </div> \
          </nav> \
          <div class="username-verification text-right"></div>',

  template: _.template('<nav class="navbar navbar-inverse navbar-static-top"> \
                          <div class="container-fluid"> \
                            <a href="#front" class="navbar-brand">Portfol.io</a> \
                            <ul class="nav nav-pills navbar-nav navbar-right"> \
                              <li class="username-container">Signed in as <strong class="username"><%= username %></strong></li>\
                            </ul> \
                          </div> \
                        </nav> \
                        <div class="username-verification text-right"></div>'),

  initialize: function(){
    // this.formView = new FormView({collection: this.collection});
    this.dashboardView = new DashboardView({collection: this.collection, life_events: this.model.get('life_events')});
    this.renderNavbar();
    this.renderDashboard();
    //this.lifeEventsView = new LifeEventsView({collection: this.model.get('life_events')});
    // this.aboutusView = new AboutUsView();
    // this.signupView = new SignupView({model: this.model});
    // this.signinView = new SigninView({model: this.model});
    //this.render();
    window.location.hash = 'front';
  },

  setUsername: function(name) {
    this.model.set('username', name);
    this.dashboardView.setUsername(name);
  },

  renderBody: function(view, renderDashboard) {
    this.$el.empty();
    view.delegateEvents();
    // this.formView.delegateEvents();
    // this.dashboardView.delegateEvents();
    // this.dashboardView.infoView.delegateEvents();
    var navbar = $(this.navDiv);
    if (this.model.get('signedin')) {
      navbar = this.template(this.model.attributes);
    }
    this.$el.append([
      navbar,
      view.$el,
      this.dashboardView.$el,
      // this.lifeEventsView.$el
    ]);
  },

  renderNavbar: function(){
    var navbar = $(this.navDiv);
    this.$el.append(navbar);
  },

  renderDashboard: function() {
    this.$el.append(this.dashboardView.$el);
  },

  render: function(){
    var context = this;
    // immediately makes a request to see if user is signed in
    $.ajax({
      url:'/auth',
      success: function (response) {
        context.model.set('signedin', true);
        context.setUsername(response);
        // context.renderBody(context.formView);
       },
      error: function() {
        // context.renderBody(context.formView);
      }
    });
  },

  // signup: function() {
  //   this.renderBody(this.signupView, false);
  // },

  // signin: function() {
  //   this.renderBody(this.signinView, false);
  // },

  // aboutus: function() {
  //   this.renderBody(this.aboutusView, false);
  // },

  portfolios: function () {
    this.$el.empty();
    this.portfoliosView = new PortfoliosView({collection: this.collection});
    var navbar = $(this.navDiv);
    if (this.model.get('signedin')) {
      navbar = this.template(this.model.attributes);
    }
    this.$el.append([
      navbar,
      this.portfoliosView.$el
    ]);
  }

});
