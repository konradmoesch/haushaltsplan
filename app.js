const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const apiIndexRouter = require('./routes/api/index');
const expensesRouter = require('./routes/api/expenses');
const earningsRouter = require('./routes/api/earnings');
const balanceRouter = require('./routes/api/balance');
const loginRouter = require('./routes/login');

const sessionConf = require('./config/session.json');
const sqlSessionStore = require('express-mysql-session')(session)
const con = require('./routes/helpers/db');
const app = express();
app.disable("x-powered-by");
let isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.originalUrl.split('/')[1] === 'api' || req.xhr) {
    res.sendStatus(401);
  } else {
    res.redirect('/login');
  }
};
require('run-middleware')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Passport
const sessionStore = new sqlSessionStore({
  //checkExpirationInterval: sessionConf.timeout / 4,
  //expiration: sessionConf.timeout,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'sid',
      expires: 'expires',
      data: 'data'
    }
  }
}, con);
app.use(session(
    {
      name: sessionConf.name,
      secret: sessionConf.secret,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      ephemeral: true,
      store: sessionStore,
      cookie: {
        path: '/',
        domain: sessionConf.domain,
        httpOnly: true,
        //secure: true,
        secure: false,
        sameSite: 'strict',
        maxAge: sessionConf.timeout
      }
    }
));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(function (req, res, next){
    res.locals.user = req.user;
    res.locals.version = require('./package.json').version;
    next();
});

app.use('/login', loginRouter);
app.use('/api/users', isAuthenticated, usersRouter);
app.use('/api/index', isAuthenticated, apiIndexRouter);
app.use('/api/expenses', isAuthenticated, expensesRouter);
app.use('/api/earnings', isAuthenticated, earningsRouter);
app.use('/api/balance', isAuthenticated, balanceRouter);
app.use('/', isAuthenticated, indexRouter);

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
