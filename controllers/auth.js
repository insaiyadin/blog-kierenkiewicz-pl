const bcrypt = require('bcryptjs')

const {
    PrismaClient
} = require('@prisma/client');
const {
    redirect
} = require('express/lib/response');
const prisma = new PrismaClient();

exports.getLogin = (req, res, next) => {
    return res.render('auth/login', {
        pageTitle: 'Logowanie',
        isAuthenticated: false
    });
};

exports.postLogin = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        return res.redirect('/auth/login');
    }

    bcrypt.compare(password, user.password).then(match => {
        if (match) {
            req.session.isAuthenticated = true;
            req.session.user = user;
            return req.session.save(err => {
                return res.redirect('/');
            });
        }
        res.redirect('/auth/login')
    }).catch(err => {
        console.log(err);
        return res.redirect('/auth/login');
    });
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

        // ###### 

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            if (password && password2 && password === password2) {
                const hashedPassword = await bcrypt.hash(password, 12);
                await prisma.user.create({
                    data: {
                        email: email,
                        password: hashedPassword
                    }
                })
                return res.redirect('/auth/login');
            };
        };
        return res.redirect('/auth/register');

        // ###### 

    }
    console.log("Tu");
    return res.redirect('/');
};