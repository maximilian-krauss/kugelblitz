'use strict'

let _ = require('lodash'),
    all = require('require-tree'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    exphbs = require('express-handlebars'),
    colors = require('colors'),
    morgan = require('morgan'),
    dotenv = require('dotenv').config({silent: true}),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    config = require('./app/config'),
    app = express();

var models = all('./app/models'),
    controllers = all('./app/controllers'),
    core = require('./app/core'),
    middlewares = all('./app/middlewares'),
    bundles = {};

let hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: 'views/partials/',
  helpers: {
    title: () => {
      return 'meerkat';
    },
    css: (file) => {
      return bundles.css(file);
    },
    js: (file) => {
      return bundles.js(file);
    }
  }
});

let store = new MongoDBStore({
  uri: config.mongoUri,
  collection: 'sessions'
});

app.use(cookieParser(config.cookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session')({
  name: 'meerkat.session.id',
  secret: config.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store
}));
app.use(passport.initialize());
app.use(passport.session({
  maxAge: new Date(Date.now() + 3600000),
  store: store
}));
app.use(morgan('tiny'));
app.use(compression({ threshold: 512 }));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('etag', 'strong');

app.use(require('connect-assets')({
  paths: [
    'media/js',
    'media/css'
  ],
  helperContext: bundles,
  build: true,
  fingerprinting: true,
  servePath: 'media/dist'
}));

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    core.userManager.authenticate(email, password, (err, usr) => {
      if(err) {
        return done(null, false, { message: err.message });
      }

      return done(null, usr);
    });
}));

passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    core.userManager.findBy(id, done);
});

app.use('/static/vendor', express.static(__dirname + '/bower_components', {
    maxAge: '364d',
}));

_.each(controllers, function(controller) {
  controller.apply({
    app: app,
    core: core,
    config: config,
    passport: passport,
    middlewares: middlewares
  });
});

app.get('*', (req, res) => {
  res.status(404).send({error: 'Not found'});
});

function fireAndForget() {
  const port = process.env.PORT || 8080;

  const server = app.listen(port, () => {
    const h = server.address().address;
    const p = server.address().port;

    console.log('meerkat is literally up and running at http://%s:%s'.green, h, p); // Baxxter
  });
}

mongoose.connection.on('error', (err) => {
    throw new Error(err);
});

mongoose.connection.on('disconnected', () => {
    throw new Error('Could not connect to database');
});

mongoose.connect(config.mongoUri, (err) => {
  if(err) {
    throw new Error(err);
  }
  fireAndForget();
});
