const config = require('./config');
const express = require('express');
const session = require('express-session');
const sessionFileStore = require('session-file-store');
const winston = require('winston');

const app = express();

const fileStore = sessionFileStore(session);

const passport = require('passport');
const auth = require('./auth');
auth(passport);

const sessionMiddleware = session({
    resave: true,
    saveUninitialized: true,
    store: new fileStore({}),
    secret: 'supersecret'
});

const consoleTransport = new winston.transports.Console();

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        consoleTransport
    ]
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
    scope: config.scopes,
    failureFlush: true,
    session: true
}));

app.get(
    '/auth/google/callback',
    passport.authenticate(
        'google', {failureRedirect: '/', failureFlush: true, session: true}),
    (req, res) => {
        logger.info('User has logged in');
        res.redirect('/')
    });

let images = [
    {
        id: "1",
        url: "/images/landscape01.png"
    },
    {
        id: "2",
        url: "/images/landscape02.png"
    },
    {
        id: "3",
        url: "/images/portrait01.png"
    },
    {
        id: "4",
        url: "/images/portrait02.png"
    },
    {
        id: "5",
        url: "/images/landscape03.png"
    },
    {
        id: "6",
        url: "/images/portrait03.png"
    }
];

let setupDone = false;

app.post('/setup/done', (req, res) => {
    setupDone = true;
    res.send();
});

app.get('/images/list', (req, res) => {
    let response = {
        setupDone: setupDone
    };

    if (setupDone) {
        response.images = images;
    }

    res.send(response);
});

app.get('/', (req, res) => res.redirect('setup'));

app.use('/node_modules', express.static('node_modules'));
app.use('/auth', express.static('auth'));
app.use('/setup', express.static('setup'));
app.use('/projector', express.static('projector'));
app.use('/images', express.static('images'));

app.listen(config.port, () => logger.info(`Slide projector listening at http://localhost:${config.port}`));

