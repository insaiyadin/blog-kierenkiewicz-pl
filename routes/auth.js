const express = require('express');
const {
    check,
    body
} = require('express-validator');

const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

const authController = require('../controllers/auth');

const router = express.Router();

// /admin/some-link => GET
router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/register', authController.getRegister);

router.post(
    '/register',
    [
        check('email')
        .isEmail()
        .withMessage('Wpisz poprawny adres email')
        .custom((val, {
            req
        }) => {
            return prisma.user.findUnique({
                    where: {
                        email: val
                    }
                })
                .then(user => {
                    if (user) {
                        return Promise.reject('Adres email jest już zajęty');
                    }
                })
        }),
        body('password', 'Hasło jest za krótkie').isLength({
            min: 6,
            max: 18
        }).isAlphanumeric(),
        body('password2').custom((val, {
            req
        }) => {
            if (val !== req.body.password) {
                throw new Error('Hasła nie są takie same');
            }
            return true;
        })
    ],
    authController.postRegister);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset_password_completed', authController.postNewPassword);

module.exports = router;