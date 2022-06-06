// module.exports = (req, res, next) => {
//     if (!req.session.user.isSuperuser) {
//         return res.redirect('/');
//     };
//     next();
// }

module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    };
    next();
}