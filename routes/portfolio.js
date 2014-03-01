// GET portfolio page

var mongoUri = process.env.MONGOHQ_URL || require('../config.js').mongohq_uri;
var db = require('mongojs').connect(mongoUri, ['portfolio']);

module.exports = function (req, res) {
    db.portfolio.find({}, function (err, items) {
        if (err) {
            res.render('portfolio', {
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