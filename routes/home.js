const path = require('path');

const express = require('express');

const indexController = require('../controllers/main-page');

const router = express.Router();

// /admin/some-link => GET
router.get('/', indexController.getIndex);

module.exports = router;