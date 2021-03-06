'use strict'

var app = angular.module('uiApp');

app.service('svGetMedia', [
    '$rootScope',
    '$scope',
    '$resource',
    'myAppConfig',
    function($rootScope, $scope, $resource) {
        // The width and height of the captured photo. We will set the
        // width to the value defined here, but the height will be
        // calculated based on the aspect ratio of the input stream.
        var width = 320;    // We will scale the photo width to this
        var height = 0;     // This will be computed based on the input stream
        // |streaming| indicates whether or not we're currently streaming
        // video from the camera. Obviously, we start at false.

        var factory = {};
        var streaming = false;

        // The various HTML elements we need to configure or control. These
        // will be set by the startup() function.

        var video = null;
        var canvas = null;
        var photo = null;
        var takePhotoBtn = null;

        this.startup = function() {
            video = document.getElementById('video');
            canvas = document.getElementById('canvas');
            photo = document.getElementById('photo');
            takePhotoBtn = document.getElementById('takephoto');

            navigator.getMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);

            navigator.getMedia({
                "audio": false,
                "video": {
                    "mandatory": {
                        "maxWidth": 640,
                        "maxHeight": 480,
                        "minAspectRatio": 1.333,
                        "maxAspectRatio": 1.334,
                        "maxFrameRate": 30
                    }
                }
            },
                function(stream) {
                    if (navigator.mozGetUserMedia) {
                        video.mozSrcObject = stream;
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();
                },
                function(err) {
                    console.log("An error occured! ", err);
                }
            );

            video.addEventListener('canplay', function(ev) {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    streaming = true;
                }
            }, false);

            takePhotoBtn.addEventListener('click', function(ev) {
                var dataUrl = this.takepicture();
                photo.setAttribute('src', dataUrl);
                ev.preventDefault();
            }, false);

            clearphoto();
        }

        // Fill the photo with an indication that none has been
        // captured.

        function clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            var dataUrl = canvas.toDataURL('image/png');
            return dataUrl;
        }

        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.

        this.takepicture = function() {
            var context = canvas.getContext('2d');
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);

                var dataUrl = canvas.toDataURL('image/png');
                return dataUrl;
            } else {
                var dataUrl = clearphoto();
                return dataUrl;
            }
        }

        // Set up our event listener to run the startup process
        // once loading is complete.
        // window.addEventListener('load', startup, false);
    }]);