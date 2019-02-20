let express      = require('express');
let logger       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');

let routes  = require('./routes/index');
let catalog = require('./routes/catalog');

let app = express();

app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );

app.use('/', routes);
app.use('/catalog', catalog);


// catch 404 and forward to error handler
app.use(function(req, res, next)
{
  let err = new Error('Not Found');

  err.status = 404;
  next(err);
});

//development error handler will print stacktrace
if (app.get('env') === 'development')
{
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
