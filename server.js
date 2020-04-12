const bodyParser = require('body-parser');
const config = require('./config');
const express = require('express');
const request = require('request-promise');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

let selectedAlbumId = null;

app.get('/albums', async (req, res) => {
    let data = {};
    if (req.user) {
        data = await getAlbums(req.user.token);
    }
    res.status(200).send(data);
});

app.put('/selectedAlbumId', (req, res) => {
    selectedAlbumId = req.body.albumId;
    logger.info('User selected album, id: ' + selectedAlbumId);
    res.send();
});

app.get('/photos/list', async (req, res) => {
    let response = {
        setupDone: !! selectedAlbumId
    };

    if (selectedAlbumId) {
        response = {...response, ...await getPhotosInAlbum(selectedAlbumId, req.user.token)};
    }

    res.send(response);
});

app.get('/', (req, res) => res.redirect('setup'));

app.use('/node_modules', express.static('node_modules'));
app.use('/auth', express.static('auth'));
app.use('/setup', checkAuthentication);
app.use('/setup', express.static('setup'));
app.use('/projector', express.static('projector'));
app.use('/images', express.static('images'));

function checkAuthentication(req, res, next) {
    if (!req.user || !req.isAuthenticated()) {
        res.redirect('/auth');
    } else {
        next();
    }
}

app.listen(config.port, () => logger.info(`Slide projector listening at http://localhost:${config.port}`));

async function getAlbums(authToken) {
    let albums = [];
    let error = null;
    let parameters = {pageSize: config.albumPageSize};

    try {
        do {
            const result = await request.get(config.apiEndpoint + '/v1/albums', {
                headers: {'Content-Type': 'application/json'},
                qs: parameters,
                json: true,
                auth: {'bearer': authToken}
            });

            if (result && result.albums) {
                const items = result.albums.filter(x => !!x);

                albums = albums.concat(items);
            }

            parameters.pageToken = result.nextPageToken;
        } while (parameters.pageToken != null)
    } catch (e) {
        error = e.error.error || {name: e.name, code: e.statusCode, message: e.message};
    }

    return {albums, error};
}

async function getPhotosInAlbum(albumId, authToken) {
    let photos = [];
    let error = null;
    let parameters = {albumId, pageSize: config.searchPageSize};

    try {
        do {
            const result = await request.post(config.apiEndpoint + '/v1/mediaItems:search', {
                headers: {'Content-Type': 'application/json'},
                json: parameters,
                auth: {'bearer': authToken}
            });

            const items = result && result.mediaItems ?
                result.mediaItems
                    .filter(x => x)
                    .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
                [];

            photos = photos.concat(items);

            parameters.pageToken = result.nextPageToken;
        } while (parameters.pageToken != null)
    } catch (e) {
        error = e.error.error || {name: e.name, code: e.statusCode, message: e.message};
    }

    return {photos, error};
}
