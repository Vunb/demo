'use strict';

var vgaButton = document.querySelector('button#vga');
var qvgaButton = document.querySelector('button#qvga');
var hdButton = document.querySelector('button#hd');
var svButton = document.querySelector('button#sv');
var customBtn = document.querySelector('button#custom');
var dimensions = document.querySelector('p#dimensions');
var video = document.querySelector('video');

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(stream) {
    window.stream = stream; // stream available to console
    video.src = window.URL.createObjectURL(stream);
}

function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function displayVideoDimensions() {
    dimensions.innerHTML = 'Actual video dimensions: ' + video.videoWidth +
        'x' + video.videoHeight + 'px.';
}

video.addEventListener('play', function() {
    setTimeout(function() {
        displayVideoDimensions();
    }, 500);
});

var qvgaConstraints = {
    video: {
        mandatory: {
            maxWidth: 320,
            maxHeight: 180
        }
    }
};

var vgaConstraints = {
    video: {
        mandatory: {
            maxWidth: 640,
            maxHeight: 360
        }
    }
};

var hdConstraints = {
    video: {
        mandatory: {
            minWidth: 1280,
            minHeight: 720
        }
    }
};

var svConstraints = {
    video: {
        mandatory: {
            maxWidth: 768,
            maxHeight: 576,
            maxAspectRatio: 1.333,
            maxFrameRate: 30
        }
    }
};

qvgaButton.onclick = function() {
    getMedia(qvgaConstraints);
};
vgaButton.onclick = function() {
    getMedia(vgaConstraints);
};
hdButton.onclick = function() {
    getMedia(hdConstraints);
};
svButton.onclick = function() {
    getMedia(svConstraints);
};

customBtn.onclick = function() {
    var input = document.querySelector("textarea#textValue");
    var txtValue = input.value;
    if (txtValue) {
        var constraints = JSON.parse(txtValue);
        getMedia(constraints);
    }
}

navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

function getMedia(constraints) {
    if (window.stream && window.stream.stop) {
        video.src = null;
        window.stream.stop();
    } else if (window.stream) {
        video.src = null;
        // if latest-chrome
        // "getAudioTracks" method's availability is checked in above block
        var mediaStream = window.stream;
        if (mediaStream.getAudioTracks().length && mediaStream.getAudioTracks()[0].stop) {
            mediaStream.getAudioTracks().forEach(function(track) {
                track.stop();
            });
        }

        if (mediaStream.getVideoTracks().length && mediaStream.getVideoTracks()[0].stop) {
            mediaStream.getVideoTracks().forEach(function(track) {
                track.stop();
            });
        }
    }
    navigator.getMedia(constraints, successCallback, errorCallback);
}

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

function snapshot() {
    if (window.stream) {
        ctx.drawImage(video, 0, 0);
        // "image/webp" works in Chrome.
        // Other browsers will fall back to image/png.
        document.querySelector('img').src = canvas.toDataURL('image/png');
    }
}

video.addEventListener('click', snapshot, false);
