// import third-party modules
var express = require('express'),
    app = express(),
    subdomains = require('express-subdomains'),
    path = require('path');

app.locals.moment = require('moment');
app.locals.baseUrl = app.get('env') === 'development' ? 'localhost:3000' : 'martinsmucker.com';

// set up middleware for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());

// add static routes before we use our router
// otherwise we get the 404 page instead of static files (js, css, etc)
app.use(express.static(path.join(__dirname, 'public')));

// in our development environment, inject the livereload script into non-static files
app.configure('development', function () {
    app.use(require('connect-livereload')());
});

// set up subdomain routes
subdomains.use('rotmg');
app.use(subdomains.middleware);

app.use(app.router);

// routes
var index = require('./app/routes/index'),
    portfolio = require('./app/routes/portfolio'),
    blog = require('./app/routes/blog'),
    groceries = require('./app/routes/groceries'),
    rotmg = require('./app/routes/rotmg'),
    error = require('./app/routes/error');

// handle http requests
app.get('/', index);
app.get('/portfolio', portfolio.list);
app.get('/portfolio/:slug', portfolio.showItem);
app.get('/blog', blog.list);
app.get('/blog/:slug', blog.showPost);
app.get('/groceries', groceries);

// handle subdomains
app.get('/rotmg/fame', rotmg.fame);
app.get('/rotmg/roll', rotmg.roll);

// handle all other (404) pages
app.get('*', error);

// start listening for server activity
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
