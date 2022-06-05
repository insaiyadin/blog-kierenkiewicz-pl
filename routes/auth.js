const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// /admin/some-link => GET
router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

module.exports = router;