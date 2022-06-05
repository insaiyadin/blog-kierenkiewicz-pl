const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/some-link => GET
router.get('/some-link', adminController.getSomeLink);

module.exports = router;