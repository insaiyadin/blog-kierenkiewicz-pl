const {
  PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

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
    title: '',
    text: '',
    pageTitle: 'Add post',
    errorMessage: ''
  });
};

exports.postAddPost = async (req, res, next) => {
  const {
    title,
    text
  } = req.body;
  const image = req.file;
  if (!image) {
    return res.render('admin/add_post', {
      pageTitle: 'Add post',

      title: title,
      text: text,

      errorMessage: 'Niepoprawny format pliku'
    })
  }

  const imgUrl = image.path;

  await prisma.post.create({
    data: {
      title: title,
      text: text,
      image: imgUrl,
      userId: req.user.id
    }
  })

  res.redirect('/');
};