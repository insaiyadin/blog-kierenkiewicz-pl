const {
    PrismaClient
} = require('@prisma/client');
const {
    redirect
} = require('express/lib/response');
const prisma = new PrismaClient();

exports.getLogin = (req, res, next) => {
    const isAuth = req.session.isAuthenticated;
    if (!isAuth) {
        return res.render('auth/login', {
            pageTitle: 'Logowanie',
            isAuthenticated: false
        });
    }
    res.redirect('/');
};

exports.postLogin = (req, res, next) => {
    req.session.isAuthenticated = true;
    req.session.save(err => {
        return res.redirect('/');
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        return res.redirect('/');
    });
};

exports.getRegister = (req, res, next) => {
    const isAuth = req.isAuthenticated;
    if (!isAuth) {
        return res.render('auth/register', {
            pageTitle: 'Rejestracja',
            isAuthenticated: false
        });
    }
    return res.redirect('/');
};

exports.postRegister = async (req, res, next) => {
    const isAuth = req.isAuthenticated;
    if (!isAuth) {
        const {
            email,
            password,
            password2
        } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            if (password && password2 && password === password2) {
                await prisma.user.create({
                    data: {
                        email: email,
                        password: password
                    }
                })
                return res.redirect('/auth/login');
            };
        };
        return res.redirect('/auth/register');
    }
    return res.redirect('/');
};