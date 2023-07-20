var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/web/index');

//導入接口文件
const accountRouter = require('./routes/api/account');
const authApiRouter = require('./routes/api/auth')

//導入登入註冊路由文件
const authRouter = require('./routes/web/auth')

//導入express session
const session = require('express-session')
const MongoStore = require('connect-mongo')

//導入配置項
const {DBHOST, DBPORT, DBNAME} = require('./config/config')
var app = express();

// view engine-setup
app.use(session(
  {
    name:'sid',
    secret:'ianzhou',
    saveUninitialized:false,
    resave:true,
    store:MongoStore.create({
      mongoUrl:`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`
    }),
    cookie:{
      httpOnly:true,
      maxAge:1000*60*60*24*7
    }
  }
))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',accountRouter);
app.use('/',authRouter)
app.use('/api',authApiRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404',{
    msg:"404 找不到資源",
    url:'/'
  })
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
