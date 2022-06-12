const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');
const isAdmin = require('../middleware/is-admin');

const {
    check,
    body
} = require('express-validator');

const router = express.Router();

// /admin => GET
router.get('/', isAuthenticated, isAdmin, adminController.getIndex);

router.get('/add-post', isAuthenticated, isAdmin, adminController.getAddPost);

router.post('/add-post', isAuthenticated, isAdmin,
    [
        body('title').isLength({
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

router.post('/edit-post', isAuthenticated, isAdmin, adminController.postEditPost);

module.exports = router;