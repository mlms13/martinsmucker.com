
var mongoUri = process.env.MONGOHQ_URL || require('../config.js').mongohq_uri;
var db = require('mongojs').connect(mongoUri, ['portfolio']);

module.exports.list = function (req, res) {

};

module.exports.showPost = function (req, res) {
    db.portfolio.findOne({slug: req.params.slug}, function (err, item) {
        if (err) {
          res.render('blogpost', {
            error: {
              title: "Troubles!",
              body: "We ran into some problems connecting to the database."
            }
          });
        } else if (!item) {
            req.render('blogpost', {
                title: "The Blog Post Wasn't Found",
                content: "<p>Are you sure the URL is correct? Because we looked pretty hard and couldn't find anything.</p>"
            });
        } else {
            req.render('blogpost', {
                title: item.title,
                subtitle: item.subtitle,
                content: item.content
            });
        }
    });
};