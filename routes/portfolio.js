
/*
 * GET portfolio page
 */

var mongo = require('mongodb');
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});

exports.create = function(req, res){
  res.render('portfolio', {title: "Michael Martin-Smucker: Code and Design for the Modern Web"});
};