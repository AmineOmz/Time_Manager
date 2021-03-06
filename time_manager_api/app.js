var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

/* swagger */
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var swStats = require('swagger-stats');

/* JWT */
var expressJwt = require('express-jwt');
var jwtSecret = process.env.JWT_SECRET;

/* route stuff */
var indexRouter = require('./routes/index');
var employeesRouter = require('./routes/employee');
var clocksRouter = require('./routes/clock');
var workingTimeRouter = require('./routes/workingtime');
var teamsRouter = require('./routes/teams');
var teamsContentRouter = require('./routes/teamcontent');
var cors = require('cors');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(swStats.getMiddleware({swaggerSpec: swaggerDocument}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(expressJwt({secret: jwtSecret}).unless({path: ['/api/users/sign_in', '/api/users/sign_up', '/', '/health', '/api-docs', '/swagger-stats/metrics', '/swagger-stats/ui']}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', employeesRouter);
app.use('/api/clocks', clocksRouter);
app.use('/api/workingtimes', workingTimeRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/teamscontent', teamsContentRouter);


if (process.env.HTTPS_ENABLED) {
  var fs = require('fs');
  var https = require('https');
  var privateKey = fs.readFileSync('/ssl/privkey1.pem', 'utf8');
  var certificate = fs.readFileSync('/ssl/cert1.pem', 'utf8');
  
  var credentials = {key: privateKey, cert: certificate};
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443);
  }

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
