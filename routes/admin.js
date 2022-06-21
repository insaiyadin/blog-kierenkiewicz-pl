const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');
const isAdmin = require('../middleware/is-admin');

const {
    body
} = require('express-validator');

const router = express.Router();

// /admin => GET
router.get('/', isAuthenticated, isAdmin, adminController.getIndex);

router.get('/add-post', isAuthenticated, isAdmin, adminController.getAddPost);

router.post('/add-post', isAuthenticated, isAdmin,
    [
        body('title', 'Wpisz tytuł 2-120 znaków').isLength({
            min: 2,
            max: 120
        }),
        body('text').isLength({
            min: 2,
            max: 2000
        })
    ],
    adminController.postAddPost);

router.get('/edit-post/:postId', isAuthenticated, isAdmin, adminController.getEditPost);

router.post('/edit-post', isAuthenticated, isAdmin,
    [
        body('title', 'Wpisz tytuł 2-120 znaków').isLength({
            min: 2,
            max: 120
        }),
        body('text').isLength({
            min: 2,
            max: 2000
        })
    ],
    adminController.postEditPost);

router.delete('/post/:postId', isAuthenticated, isAdmin, adminController.deletePost)

module.exports = router;