const express = require('express');

const app = express();
const port = 3000;

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

app.get('/images/list', (req, res) => {
    let response = {
        setupDone: setupDone
    };

    if (setupDone) {
        response.images = images;
    }

    res.send(response);
});

app.post('/setup/done', (req, res) => {
    setupDone = true;
    res.send();
});

app.get('/', (req, res) => res.redirect('projector'));

app.use('/node_modules', express.static('node_modules'));
app.use('/setup', express.static('setup'));
app.use('/projector', express.static('projector'));
app.use('/images', express.static('images'));

app.listen(port, () => console.log(`Slide projector listening at http://localhost:${port}`));
