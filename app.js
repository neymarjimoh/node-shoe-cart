if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config()
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser = require("body-parser");
var expressHbs = require('express-handlebars')
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const flash = require('express-flash')
const MongoStore = require('connect-mongo')(session)

// Routes..
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

// Database connection
mongoose.connect(
    'mongodb+srv://neymarjimoh:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-xjpod.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true ,
      useUnifiedTopology: true
    }
)
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Local Database Mongoose Connection..
// var mongoDB = 'mongodb://127.0.0.1/shoes-cart';
// mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
// var db = mongoose.connection;
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// passport config file
const initializePassport = require('./config/passport')
initializePassport(passport)

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.set('trust proxy', 1)


// Session 
app.use(session({
  secret: process.env.SESSION_KEY,
  // secret: 'mysupersecret',
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000, secure: true }
}))

// Connect flash and setting up passport
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise

// global variables in views
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session
  next()
})

// middleware use for the routes
app.use('/user', userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
