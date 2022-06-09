const {
  redirect
} = require("express/lib/response");

exports.getIndex = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
  });
};

exports.getAddPost = (req, res, next) => {
  res.render('admin/add_post', {
    pageTitle: 'Add post',
  });
};

exports.postAddPost = (req, res, next) => {
  const {
    title,
    text
  } = req.body;
  const image = req.file;
  console.log(title);
  console.log(text);
  console.log(image);
  res.redirect('/');
};