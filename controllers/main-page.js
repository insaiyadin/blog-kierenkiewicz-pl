const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Home',
        isAuthenticated: req.session.isAuthenticated,
        posts: []
    });
};