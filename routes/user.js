const express = require('express');
const {
    check,
    body
} = require('express-validator');

const isAuthenticated = require('../middleware/is-authenticated');

const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

const userController = require('../controllers/user');

const router = express.Router();

router.get('/image/:userId', isAuthenticated, userController.getUserImage);

module.exports = router;