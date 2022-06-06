module.exports = (req, res, next) => {
    if (!req.user.isSuperuser) {
        return res.redirect('/');
    };
    next();
}