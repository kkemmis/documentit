const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const electronScreen = electron.screen;
const shell = electron.shell;

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshot = document.getElementById('screen-shot');
const screenshotMsg = document.getElementById('screenshot-path');
const pathButton = document.getElementById('path-button');
const casenameField = document.getElementById('casename');

var screenshotPath = '';
var caseName = '';

pathButton.addEventListener('click', function(event) {
    dialog.showSaveDialog(function(fileName) {
        if (fileName === undefined) {
            return;
        }
        screenshotPath = fileName;
        screenshotMsg.textContent = screenshotPath;
    });
});

screenshot.addEventListener('click', function(event) {
    screenshotMsg.textContent = 'Gathering screenshot...';
    const thumbSize = determineScreenShot();
    let options = { types: ['screen'], thumbnailSize: thumbSize };

    desktopCapturer.getSources(options, function(error, sources) {
        if (error) return console.log(error.message);

        sources.forEach(function(source) {
            if (source.name === 'Entire Screen' || source.name === 'Entire screen' || source.name === 'Screen 1') {

                caseName = casenameField.value;
                if (screenshotPath === '') {
                    timestamp = new Date().getTime();
                    screenshotPath = path.join(os.tmpdir(), caseName + '-' + timestamp + '.png');
                }

                fs.writeFile(screenshotPath, source.thumbnail.toPng(), function(error) {
                    if (error) return console.log(error.message);

                    shell.openExternal('file://' + screenshotPath);
                    var message = 'Saved screenshot to: ' + screenshotPath;
                    screenshotMsg.textContent = message;
                })
            }
        });
    });
});

function determineScreenShot() {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    };
}