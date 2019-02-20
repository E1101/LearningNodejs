var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var catalog = require('./routes/catalog');
var expressPaginate = require('express-paginate')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/catalog', catalog);
app.use(expressPaginate.middleware(10,100));


/**
 * Note:
 *
 * There is an npm module—swagger-ui—that wraps up the default swagger frontend for us.
 * We will adopt it in our application, so let's use the package manager to install
 * it—npm install swagger-ui.
 *
 * Once installed, simply require an instance of the module along with an instance of the
 * static swagger.json file and use them in a separate route
 */
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');

app.use('/catalog/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/**
 * Note:
 *
 * Serving the wadl file statically will help your application in getting indexed by search engines.
 */
app.use('/catalog/static', express.static('static'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
