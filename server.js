var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var handler = require('./request-handler.js');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('./db/config');
var Users = require('./db/collections/users');
var User = require('./db/models/user');
var Stocks = require('./db/collections/stocks');
var Stock = require('./db/models/stock');
var Portfolio = require('./db/models/portfolio');




var app = express();
app.use(session({
  secret: 'SPLEWT',
}));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
// var stockRouter = express.Router();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy( function(username, password, done) {
  new User({username: username}).fetch().then(function(found){
      if(found){
        bcrypt.compare(password, found.get('password'), function(error , result){
          if(result){
            return done(null, found);
          } else {
            return done(null, false, {message: 'incorrect password'});
          }
        });
      } else {
        return done(null, false, {message: 'incorrect username'});
      }
    });
}));

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/#signin');
};
app.use(passport.initialize());
app.use(passport.session());

app.get('/signout', function(req, res){
  req.session.destroy();
  res.redirect('/#signin');
});

app.post('/signin',
  passport.authenticate('local', { successRedirect: '/#front',
                                   failureRedirect: '/#signin',
                                   failureFlash: true})
);

app.post('/signup', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  new User({username: username}).fetch().then(function(found){
    if(found){
      console.log('found');
      res.status(400).send('username exists');
    } else {
      var user = new User({
        username: username,
        password: password
      });
      user.save().then(function(newUser){
        passport.authenticate('local') (req, res, function() {
          res.send(newUser);
        });
      });
    }
  });

});





app.use('/api/stocks', handler.getStocks);

// require('./request-handler')(stockRouter);

var port = process.env.PORT || 8080;

app.listen(port);
console.log('Listening to: ' + port);