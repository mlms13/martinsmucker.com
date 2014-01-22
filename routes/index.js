
/*
 * GET home page.
 */

var mongoUri = process.env.MONGOHQ_URL || require('../config.js').mongohq_uri;
var db = require('mongojs').connect(mongoUri, ['portfolio']);

module.exports = function (req, res) {
  db.portfolio.find({favorite: true}, function (err, items) {
    if (err) {
      res.render('index', {
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