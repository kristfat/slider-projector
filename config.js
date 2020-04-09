const fs = require('fs');

const config = {};

let credentials = JSON.parse(fs.readFileSync('credentials.json'));

config.oAuthClientID = credentials.oAuthClientID;
config.oAuthClientSecret = credentials.oAuthClientSecret;
config.oAuthCallbackUrl = credentials.oAuthCallbackUrl;
config.port = 8080;
config.scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'profile',
];
config.photosToLoad = 150;
config.searchPageSize = 100;
config.albumPageSize = 50;
config.apiEndpoint = 'https://photoslibrary.googleapis.com';

module.exports = config;
