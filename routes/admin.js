const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// /admin => GET
router.get('/', isAuthenticated, isAdmin, adminController.getIndex);

module.exports = router;