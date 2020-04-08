//Sound
const hum = new Howl({
    src: ['sound/hum.wav'],
    autoplay: true,
    loop: true
});
hum.play();

const slideChange = new Howl({
    src: ['sound/slide_change.wav']
});

const directionChange = new Howl({
    src: ['sound/direction_change.wav']
});

let isMuted = false;

//Images
const slider = document.getElementById('slider');
const currentSlide = document.getElementById('image');

let images, position, direction, isSliding;

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
    isSliding = true;
    slider.classList.add('sliding');
}

function endSliding() {
    isSliding = false;
    slider.classList.remove('sliding');
}

function slideAndUpdate() {
    startSliding();
    slideChange.play();
    setTimeout(function () {
        updateImageSources();
        endSliding();
    }, 1000);
}

function showNextSlide() {
    if (isSliding) {
        return;
    }

    if (position <= 0 && direction === -1 || position >= images.length - 1 && direction === 1) {
        return;
    }

    position += direction;
    slideAndUpdate();
}

function changeDirection() {
    directionChange.play();
    direction = -direction;
}

function initSlides() {
    position = 0;
    direction = 1;
    isSliding = false;
    updateImageSources();
}

// Key bindings
window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        showNextSlide();
    }
    if (event.code === 'Enter') {
        changeDirection();
    }
    if (event.code === 'KeyS') {
        isMuted = !isMuted;
        Howler.mute(isMuted);
    }
});

// Fetch image list
const xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
    let response = JSON.parse(this.responseText);
    images = response.images;
    initSlides();
});
xhr.open('GET', '/image-list');
xhr.send();

