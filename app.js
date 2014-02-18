// import third-party modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    path = require('path');

// set up middleware for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// add static routes before we use our router
// otherwise we get the 404 page instead of static files (js, css, etc)
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// routes
var index = require('./routes/index'),
    portfolio = require('./routes/portfolio'),
    blog = require('./routes/blog'),
    groceries = require('./routes/groceries'),
    error = require('./routes/error');

// handle http requests
app.get('/', index);
app.get('/portfolio', portfolio);
app.get('/blog', blog.list);
app.get('/blog/:slug', blog.showPost);
app.get('/groceries', groceries);
app.get('*', error);

// start listening for server activity
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
