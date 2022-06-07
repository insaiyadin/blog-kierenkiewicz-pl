const crypto = require('crypto');

const bcrypt = require('bcryptjs');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'mail40.mydevil.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailUserPassword
    }
});

// validation
const {
    validationResult
} = require('express-validator')

const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

const {
    redirect
} = require('express/lib/response');


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
        password
    } = req.body;

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        console.log(validationErrors.array());
        return res.status(422).render('auth/register', {
            pageTitle: 'Rejestracja',
            errorMessage: validationErrors.array()[0].msg
        })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword
        }
    });

    const msg = {
        to: email,
        from: 'blog@kierenkiewicz.pl',
        subject: 'Logowanie',
        html: '<h1>Rejestracja przebiegła pomyślnie</h1>'
    }

    // add sending emails via CRON

    transporter.sendMail(msg, err => {
        console.log(err);
    });

    return res.redirect('/auth/login');


    // ###### 
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset_password', {
        pageTitle: 'Reset hasła',
        errorMessage: message
    });
}

exports.postReset = async (req, res, next) => {
    const {
        email
    } = req.body;

    const buffer = crypto.randomBytes(32);
    const token = buffer.toString('hex');

    const now = new Date();
    now.setMinutes(now.getMinutes() + 15)

    try {
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                resetToken: token,
                resetTokenExpirationDate: now
            }
        })

        const msg = {
            to: email,
            from: 'blog@kierenkiewicz.pl',
            subject: 'Restart hasła',
            html: `
                <p>Poprosiłes o reset hasła</p>
                <p>Skorzystaj z <a href="http://localhost:3000/auth/reset/${token}">TEGO</a> odnośnika</p>
                `
        }

        transporter.sendMail(msg);

        return res.redirect('/auth/login');
    } catch (err) {
        // console.log(err);
        req.flash('error', 'Taki adres email nie istnieje')
        return res.redirect('/auth/reset');
    }
}

exports.getNewPassword = async (req, res, next) => {
    const {
        token
    } = req.params;

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpirationDate: {
                gte: new Date()
            }
        }
    })

    if (!user) {
        req.flash('error', 'Token wygasł lub nie istnieje');
        return res.redirect('/auth/reset');
    }

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/new_password', {
        pageTitle: 'Ustalanie hasła',
        errorMessage: message,
        userId: user.id,
        token: token
    })
}

exports.postNewPassword = async (req, res, next) => {
    const {
        newPassword,
        userId,
        token
    } = req.body;

    const userParsedId = parseInt(userId);

    const user = await prisma.user.findFirst({
        where: {
            id: userParsedId,
            resetToken: token,
            resetTokenExpirationDate: {
                gte: new Date()
            }
        }
    })

    if (user) {
        await prisma.user.update({
            where: {
                id: userParsedId
            },
            data: {
                password: await bcrypt.hash(newPassword, 12),
                resetToken: null,
                resetTokenExpirationDate: null
            }
        })

        // switch to success to display message
        req.flash('error', 'Udało się zresetować hasło');
        return res.redirect('/auth/login');
    }

    req.flash('error', 'Token wygasł lub nie istnieje');
    res.redirect('/auth/reset');
}