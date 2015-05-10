
// Fall back to a generic error page
module.exports = function (req, res) {
    res.status(404).render('error', {title: "Page not found"});
};
