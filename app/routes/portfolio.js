// GET portfolio page

var mongoUri = process.env.MONGOHQ_URL || require('../../config.js').mongohq_uri;
var db = require('mongojs').connect(mongoUri, ['portfolio']);

module.exports.list = function (req, res) {
    db.portfolio.find().sort({date: -1}, function (err, items) {
        if (err) {
            res.status(500).render('portfolio', {
                error: {
                    title: "Troubles!",
                    body: "We ran into some problems connecting to the database."
                }
            });
        } else if (!items) {
            res.render('portfolio', {
                error: {
                    title: "The portfolio is empty",
                    body: "Nothing has been added to my portfolio yet. Check back soon!"
                }
            });
        } else {
            res.render('portfolio', {
                title: 'Michael Martin-Smucker: Code and Design for the Modern Web',
                items: items
            });
        }
    });
};

module.exports.showItem = function (req, res) {
    db.portfolio.findOne({slug: req.params.slug}, function (err, item) {
        if (err) {
            res.status(500).render('portfolio-item', {
                title: 'Troubles!',
                body: 'We ran into some problems connecting to the database.'
            });
        } else if (!item) {
            res.status(404).render('portfolio-item', {
                title: 'Portfolio item not found',
                content: '<p>No portfolio item was found with a URL of <code>/' + req.params.slug + '</code>.</p>'
            });
        } else {
            // add the codepen slug hash automatically
            item.codepenHash = item.links.demo ?
                               item.links.demo.substring(item.links.demo.lastIndexOf('/')) : '';
            res.render('portfolio-item', item);
        }
    });
};
