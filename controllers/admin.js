exports.getIndex = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
    isAuthenticated: req.session.isAuthenticated,
  });
};