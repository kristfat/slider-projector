const path = require('path');

const express = require('express');

const app = express();
const port = 3000;

app.get('/image-list', (req, res) => res.sendFile(path.join(__dirname, 'images.json')));
app.get('/', (req, res) => res.redirect('projector'));

app.use('/node_modules', express.static('node_modules'));
app.use('/projector', express.static('projector'));
app.use('/images', express.static('images'));

app.listen(port, () => console.log(`Slide projector listening at http://localhost:${port}`));
