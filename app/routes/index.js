// GET home page.

var mongoUri = process.env.MONGOHQ_URL || require('../../config.js').mongohq_uri;
var db = require('mongojs').connect(mongoUri, ['portfolio']);

module.exports = function (req, res) {
    db.portfolio.find({favorite: true}).sort({date: -1}).limit(6, function (err, items) {
        if (err) {
            res.status(500).render('index', {
                error: {
                    title: "Troubles!",
                    body: "We ran into some problems connecting to the database."
                }
            });
        } else {
            res.render('index', {
                items: items
            });
        }
    });
};
