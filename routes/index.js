
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: "Michael Martin-Smucker: Code and Design for the Modern Web"});
};