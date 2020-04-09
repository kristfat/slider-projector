const albums = document.getElementById('albums');

let xhr = new XMLHttpRequest();
xhr.addEventListener('load',  function () {
    let response = JSON.parse(this.responseText);
    response.albums.forEach(album => {
        let link = document.createElement('a');
        link.innerText = album.title;
        link.href = '#';
        link.addEventListener('click', function () {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', '/selectedAlbumId');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({albumId: album.id}));
        });
        albums.appendChild(link);
        albums.appendChild(document.createElement('br'));
    })
});
xhr.open('GET', '/albums');
xhr.send();
