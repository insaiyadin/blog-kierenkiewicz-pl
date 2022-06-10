const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getIndex = async (req, res, next) => {

    const posts = await prisma.post.findMany({
        where: {
            visitable: true
        }
    })

    res.render('index', {
        pageTitle: 'Home',
        posts: posts
    });
};