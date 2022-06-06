const bcrypt = require('bcryptjs')

const {
    PrismaClient
} = require('@prisma/client');
const {
    redirect
} = require('express/lib/response');
const prisma = new PrismaClient();

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/login', {
        pageTitle: 'Logowanie',
        errorMessage: message
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
        req.flash('error', 'Niepoprawny adres email lub hasło');
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
        req.flash('error', 'Niepoprawny adres email lub hasło');
        res.redirect('/auth/login')
    }).catch(err => {
        console.log(err);
        return res.redirect('/auth/login');
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        return res.redirect('/');
    });
};

exports.getRegister = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/register', {
        pageTitle: 'Rejestracja',
        errorMessage: message
    });
};

exports.postRegister = async (req, res, next) => {
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
        if (password && password2) {
            if (password === password2) {
                const hashedPassword = await bcrypt.hash(password, 12);
                await prisma.user.create({
                    data: {
                        email: email,
                        password: hashedPassword
                    }
                })
                return res.redirect('/auth/login');
            }
            req.flash('error', 'Hasła nie są takie same')
            return res.redirect('/auth/register');
        };
    };

    req.flash('error', 'Ten adres email już istnieje')
    res.redirect('/auth/register');

    // ###### 
};