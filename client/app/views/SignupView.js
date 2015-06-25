// Backbone view for the stock submission form
var SignupView = Backbone.View.extend({

  className: 'form container',

  divText: '\
      <div class="container"> \
        <div class="row"> \
          <div class="col-md-4 col-md-offset-4 well text-center" id="select-form">\
            <div>Sign Up</div>\
            <form data-toggle="validator" role="form">\
              <div class="form-group"> \
                <label for="username">Username</label>\
                <input pattern="[a-zA-Z0-9]{5,15}" minlength="5" type="text" id="username" class="form-control" data-error="Invalid Username" required>\
                <div class="help-block with-errors">Username of 5-15 alphanumeric characters</div>\
              </div> \
              <div class="form-group"> \
                 <label for="password">Password</label>\
                 <input type="password" id="password" class="form-control" required>\
                 <div class="help-block with-errors"></div>\
              </div> \
              <button type="submit" class="btn btn-default">Submit</button>\
              <img src="assets/images/loader.gif">\
            </form>\
          </div> \
        </div> \
      </div>',

  initialize: function(){
    this.render();
    //stop loading spinner on page load
    this.stopSpinner(); 
    //stop spinner upon request completion
  },

  events: {
    //Form submission form
    'submit': 'handleSubmit'
  },

  handleSubmit: function(e) {
    var context = this;
    e.preventDefault();
    //start spinner upon stock creation
    context.startSpinner(); 
    var userSignup = {
      username: this.$('#username').val(),
      password: this.$('#password').val(),
    };

    $.ajax({
      url: "/signup",
      type: "POST",
      data: userSignup,
      success: function (result) {
        console.log(result);
        window.location.hash = 'signin';
        context.stopSpinner();
      },
      error: function(error) {
        console.log(error.responseText);
        context.stopSpinner();
      }
    });

    //Sign up new user
  },
  
  startSpinner: function(){
    this.$('img').show();
  },

  stopSpinner: function(){
    this.$('img').hide();;
  },


  render: function(){
    //Render main form
    return this.$el.html(this.divText);
  }

});
