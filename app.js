var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var multer = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var configRouter = require('./routes/config');
var panelesRouter = require('./routes/paneles');
var conferencistasRouter = require('./routes/conferencistas');
const panelUnoRouter = require('./routes/panel1');
const panelDosRouter = require('./routes/panel2');
const panelTresRouter = require('./routes/panel3');
const panelCuatroRouter = require('./routes/panel4');
const panelCincoRouter = require('./routes/panel5');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Use this after the variable declaration

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/config', configRouter);
app.use('/panels', panelesRouter);
app.use('/conference', conferencistasRouter);
app.use('/firstpanel', panelUnoRouter);
app.use('/secondpanel', panelDosRouter);
app.use('./thirdpanel', panelTresRouter);
app.use('./fourthpanel', panelCuatroRouter);
app.use('/fifthpanel', panelCincoRouter);

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
