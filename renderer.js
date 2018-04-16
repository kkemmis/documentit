const electron = require('electron');
const remote = electron.remote;
const desktopCapturer = electron.desktopCapturer;
const electronScreen = electron.screen;
const shell = electron.shell;
const dialog = remote.dialog;

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshot = document.getElementById('screen-shot');
const screenshotMsg = document.getElementById('screenshot-path');
const pathButton = document.getElementById('path-button');
const casenameField = document.getElementById('casename');

var directoryPath = '';
var caseName = '';

pathButton.addEventListener('click', function(event) {
    dialog.showOpenDialog({
            title: 'Choose a folder for DocumentIt to save in',
            buttonLabel: 'Select Path',
            properties: [
                'openDirectory',
                'createDirectory',
            ]
        },
        function(paths) {
            if (paths === undefined || paths.length === 0) {
                return;
            }
            directoryPath = paths[0]; // paths is an array, get the first (only) one
            screenshotMsg.textContent = "Path: "+directoryPath;
        });
});

screenshot.addEventListener('click', function(event) {
    screenshotMsg.textContent = 'Gathering screenshot...';
    const thumbSize = determineScreenShot();
    let options = { types: ['screen'], thumbnailSize: thumbSize };

    desktopCapturer.getSources(options, function(error, sources) {
        if (error) return displayError(error.message);

        sources.forEach(function(source) {
            if (source.name === 'Entire Screen' || source.name === 'Entire screen' || source.name === 'Screen 1') {

                caseName = casenameField.value;
                if (directoryPath === '') {
                    return displayError("Please Select a Path to save the screenshot to.");
                }

                timestamp = new Date().getTime();
                screenshotPath = path.join(directoryPath, caseName + '-' + timestamp + '.png');

                fs.writeFile(screenshotPath, source.thumbnail.toPng(), function(error) {
                    if (error) return displayError(error.message);

                    shell.openExternal('file://' + screenshotPath);
                    screenshotMsg.textContent = 'Saved screenshot to: ' + screenshotPath;
                })
            }
        });
    });
});

function displayError(message) {
    screenshotMsg.textContent = "ERROR: "+message;
    return console.log(message);
}

function determineScreenShot() {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    };
}