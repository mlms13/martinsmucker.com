
// Fall back to a generic error page
exports.show = function(req, res){
  res.render('error', {title: "Page not found"});
};