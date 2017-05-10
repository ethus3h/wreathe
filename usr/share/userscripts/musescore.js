// ==UserScript==
// @name           MuseScore.com fix
// @namespace      http://futuramerlin.com/
// @description    Fixes the download links on MuseScore.com so they don't try to slurp up private information.
// @include        *musescore.com/user/*
// @grant          none
// @version        0.0.1
// @downloadURL    https://github.com/ethus3h/wreathe/raw/master/usr/share/userscripts/musescore.js
// ==/UserScript==

// URLs look like: 
// http://static.musescore.com/(score-ID)/(download-key)/score.ext

// Get the download key
var imageElement = document.querySelector('.viewer img');
var imageUrl = imageElement.getAttribute('src');
// Image URL looks like:
// https://s3.amazonaws.com/static.musescore.com/3871256/4ccbadbc7b/score_0.png?no-cache=1494248226
var patt = new RegExp(".+\/([a-f0-9]{10}).+");
var key = imageUrl.replace(patt, '$1');

// Get a list of download buttons to fix
var dlButtons = document.querySelectorAll('#download-modal h5 > a');

for (var i = 0; i < dlButtons.length; i++)
{
    button = dlButtons[i];
    // Button URL looks like:
    // /score/3871256/download/pdf or
    // /score/3871256/download
    buttonUrl = button.getAttribute('href');

    // Get the file extension
    if (buttonUrl.match(new RegExp("download$")))
    {
        var ext = "mscz";
    }
    else
    {
       var patt = new RegExp(".+\/(\w+)$");
       //var ext = buttonUrl.replace(patt, '$1');
       //var patt = new RegExp(".+\/([0-9]{4}).+");
       var ext = buttonUrl.replace(patt, '$1');
    }
    alert(ext);

    // Get the score ID
    var patt = new RegExp("\d+");
    var id = patt.exec(buttonUrl);
    
    // Put together the fixed URL and set it as the button's target
    button.setAttribute('href', '/score/'.concat(id, '/download/', ext));
}
