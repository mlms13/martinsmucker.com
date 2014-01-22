
// Fall back to a generic error page
module.exports = function (req, res) {
  res.render('error', {title: "Page not found"});
};