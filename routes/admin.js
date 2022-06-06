const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

// /admin => GET
router.get('/', isAuthenticated, adminController.getIndex);

module.exports = router;