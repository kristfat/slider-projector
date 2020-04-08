const button = document.getElementById('submit');

button.addEventListener('click', function () {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
        button.disabled = true;
    });
    xhr.open('POST', '/setup/done');
    xhr.send();
});
