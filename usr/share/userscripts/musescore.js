// ==UserScript==
// @name           MuseScore.com fix
// @namespace      http://futuramerlin.com/
// @description    Fixes the download links on MuseScore.com so they don't try to slurp up private information.
// @include        *musescore.com/user/*
// @version        0.0.1
// @downloadURL    https://github.com/ethus3h/wreathe/raw/master/usr/share/userscripts/musescore.js
// ==/UserScript==

// URLs look like: 
// http://static.musescore.com/(score-ID)/(download-key)/score.ext

// Get the download key
var imageElement = Document.querySelector('.viewer > img');
var imageUrl = imageElement.getAttribute('src');
// Image URL looks like:
// https://s3.amazonaws.com/static.musescore.com/3871256/4ccbadbc7b/score_0.png?no-cache=1494248226
var patt = ".+\/([a-f0-9]{10})\/.+";
var key = imageUrl.replace(patt, '$1');

// Get a list of download buttons to fix
var dlButtons = [];
var foundLastElement = false;
var elementCounter = 0;
while (!foundLastElement)
{
    var foundElement = Document.querySelector('#downloadModal > h5:nth-of-type('.concat(elementCounter, ')'));
    if (foundElement != null)
    {
        dlButtons.push(foundElement);
    }
    else
    {
        foundLastElement = true;
    }
}

for (var i = 0; i < elementCounter; i++)
{
    button = dlButtons[i];
    // Button URL looks like:
    // /score/3871256/download/pdf
    buttonUrl = button.getAttribute('href');
    // Get the file extension
    var patt = new RegExp("\w+$");
    var ext = patt.exec(buttonUrl);
    // Get the score ID
    var patt = new RegExp("\d+");
    var id = patt.exec(buttonUrl);
    button.setAttribute('href', '/score/'.concat(id, '/download/', ext));
}
