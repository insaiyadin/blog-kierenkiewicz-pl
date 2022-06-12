const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();
const session = require('express-session');
const {
    PrismaSessionStore
} = require('@quixo3/prisma-session-store');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const app = express();
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'post_images')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const fileTypes = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    cb(null, false);
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const indexRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({
    storage: fileStorage,
    fileFilter: fileTypes
}).single('image'));

// static files serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/post_images', express.static(path.join(__dirname, 'post_images')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

// !! CSRF PROTECTION !!
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.user.id
        }
    })
    req.user = user;
    next();
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrf = req.csrfToken();
    res.locals.user = false;
    if (req.session.user) {
        res.locals.user = req.user;
    }
    next();
})

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

// app.get('/500', errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//     // res.status(500).render('500', {
//     //     pageTitle: 'Server error',
//     // });
//     res.status(500).redirect('/500');
// })

app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
});