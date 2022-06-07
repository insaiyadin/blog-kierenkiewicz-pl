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

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset_password_completed', authController.postNewPassword);

module.exports = router;