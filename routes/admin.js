const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// /admin => GET
router.get('/', isAuthenticated, isAdmin, adminController.getIndex);

router.get('/add-post', isAuthenticated, isAdmin, adminController.getAddPost);

router.post('/add-post', isAuthenticated, isAdmin, adminController.postAddPost);

module.exports = router;