var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

const homeRouter = require('./routes/home'); //t0d
const scanRouter = require('./routes/scan'); //t0d
//const scan_editRouter = require('./routes/scan-edit'); //t0d
const applyRouter = require('./routes/apply'); //t0d
//const editRouter = require('./routes/edit'); //t0d
const scan_edit_redirectRouter = require('./routes/scan-edit-redirect'); //t0d
const edit_entryRouter = require('./routes/edit-entry'); //t0d
const edit_success_Router = require('./routes/successful-edit'); //t0d

var app = express();

/********************* t0d***************** t0d***************** t0d***************** t0d*/
const helmet = require('helmet'); //Helmet helps you secure your Express apps by setting various HTTP headers.
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');



app.use(helmet());
app.use(bodyParser.urlencoded({ //bodyParser = middleware
    extended: false
}));

hbs.registerPartial('header', fs.readFileSync('./views/partials/header.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');
/********************* t0d***************** t0d***************** t0d***************** t0d*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //t0d

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use('/', homeRouter); //t0d
app.use('/apply', applyRouter); //t0d
app.use('/scan', scanRouter); //t0d
//app.use('/scan-edit', scan_editRouter); //t0d
//app.use('/edit', editRouter); //t0d
app.use('/scan-edit-redirect', scan_edit_redirectRouter); //t0d
app.use('/edit-entry', edit_entryRouter); //t0d
app.use('/successful-edit', edit_success_Router); //t0d



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
