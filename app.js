
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');

var app = express();

// routes
var index = require('./routes/index');
var portfolio = require('./routes/portfolio');
var blog = require('./routes/blog');
var groceries = require('./routes/groceries');
var error = require('./routes/error');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(lessMiddleware({
  src: __dirname + '/public/less',
  dest: __dirname + '/public/css',
  prefix: '/css',
  compress: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index);
app.get('/portfolio', portfolio);
app.get('/blog', blog.list);
app.get('/blog/:slug', blog.showPost);
app.get('/groceries', groceries);
app.get('*', error);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
