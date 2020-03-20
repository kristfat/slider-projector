const slider = document.getElementById('slider');
const currentSlide = document.getElementById('image');

let images, position;

function updateImageSources() {
    if (position > 0) {
        let previousImage = new Image();
        previousImage.addEventListener('load', event => console.log(event));
        previousImage.src = images[position - 1].url;
    }
    currentSlide.style.backgroundImage = `url(${images[position].url})`;
    if (position < images.length - 1) {
        let nextImage = new Image();
        nextImage.addEventListener('load', event => console.log(event));
        nextImage.src = images[position + 1].url;
    }
}

function startSliding() {
    slider.classList.add('sliding');
}

function endSliding() {
    slider.classList.remove('sliding');
}

function slideAndUpdate() {
    startSliding();
    setTimeout(function () {
        updateImageSources();
        endSliding();
    }, 1000);
}

function showPreviousSlide() {
    if (position <= 0) {
        return;
    }

    position -= 1;
    slideAndUpdate();
}

function showNextSlide() {
    if (position >= images.length - 1) {
        return;
    }

    position += 1;
    slideAndUpdate();
}

function initSlides() {
    position = 0;
    updateImageSources();
}

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowLeft') {
        showPreviousSlide();
    }
    if (event.code === 'ArrowRight') {
        showNextSlide();
    }
});

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
    let response = JSON.parse(this.responseText);
    images = response.images;
    initSlides();
});
xhr.open('GET', 'images.json');
xhr.send();
