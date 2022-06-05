exports.getSomeLink = (req, res, next) => {
  res.render('admin/some-link', {
    pageTitle: 'Add Product',
    isAuthenticated: req.session.isAuthenticated,
  });
};