const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

MAIN_PAGE_TOTAL = 1;

exports.getIndex = async (req, res, next) => {
    let page = +req.query.p || 1;

    const countPosts = await prisma.post.count({
        where: {
            visitable: true
        }
    })

    const posts = await prisma.post.findMany({
        where: {
            visitable: true
        },
        skip: (page - 1) * MAIN_PAGE_TOTAL,
        take: MAIN_PAGE_TOTAL
    })
    return res.render('index', {
        pageTitle: 'Home',
        posts: posts,
        totalPosts: countPosts,
        currentPage: page,
        hasNextPage: MAIN_PAGE_TOTAL * page < countPosts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(countPosts / MAIN_PAGE_TOTAL)
    });
};