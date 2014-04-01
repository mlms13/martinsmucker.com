// GET rotmg fame and roll calculator pages

module.exports.fame = function (req, res) {
    res.render('rotmg-fame', {
        title: "RotMG Fame Calculator",
        current: "fame"
    });
};