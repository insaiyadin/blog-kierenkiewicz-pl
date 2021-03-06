const {
  PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

const {
  validationResult
} = require('express-validator');

const deleteFile = require('../util/deleteFile');

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
    edit: false,
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

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('admin/add_post', {
      pageTitle: 'Add post',
      title: title,
      text: text,
      errorMessage: errors.array()[0].msg
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

exports.getEditPost = async (req, res, next) => {
  const {
    postId
  } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  })

  if (!post) {
    // return res.redirect('/');
    return next(new Error('Post nie istnieje'))
  }

  res.render('admin/add_post', {
    id: post.id,
    title: post.title,
    text: post.text,
    edit: true,
    pageTitle: 'Edit post',
    errorMessage: ''
  });
};

exports.postEditPost = async (req, res, next) => {
  const {
    title,
    text,
    postId
  } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  })

  if (!post) {
    return res.redirect('/');
  }

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('admin/add_post', {
      id: post.id,
      title: post.title,
      text: post.text,
      edit: true,
      pageTitle: 'Edit post',
      errorMessage: errors.array()[0].msg
    });
  }

  let imagePath = post.image;
  const image = req.file;
  if (image) {
    // remove file
    deleteFile.deleteFile(imagePath);
    imagePath = image.path;
  }

  await prisma.post.update({
    where: {
      id: Number(postId)
    },
    data: {
      title: title,
      text: text,
      image: imagePath,
      userId: req.user.id
    }
  })

  res.redirect('/');
};

exports.deletePost = async (req, res, next) => {
  const {
    postId
  } = req.params

  try {
    const removedPost = await prisma.post.delete({
      where: {
        id: +postId
      }
    })

    if (removedPost.image) {
      deleteFile.deleteFile(removedPost.image);
    }

    res.json({
      message: 'Pomy??lnie usuni??to post'
    })
  } catch {
    res.status(500).json({
      message: 'Nie uda??o si?? usun???? postu'
    })
  }

}