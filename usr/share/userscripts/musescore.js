// ==UserScript==
// @name           MuseScore.com fix
// @namespace      http://futuramerlin.com/
// @description    Fixes the download links on MuseScore.com so they don't try to slurp up private information.
// @include        *musescore.com/user/*
// @version        0.0.1
// @downloadURL    http://st.abcvg.info/swd/steamwd.user.js
// ==/UserScript==

var patt=new RegExp("[0-9]{2,15}");
var id = patt.exec(document.URL);

var realButton = document.getElementById("SubscribeItemBtn");

// shorten the text in the box because it will be in the way
realButton.parentNode.getElementsByTagName("h1")[0].innerHTML = "Download/Subscribe to the right";

var myButtonPosition = realButton.offsetWidth + 20;

var button = document.createElement('a');
button.setAttribute('class', 'btn_green_white_innerfade btn_border_2px btn_medium');
button.setAttribute('href', 'http://steamworkshop.download/download/view/' + id);
button.setAttribute('style', 'right: ' + myButtonPosition + 'px;');

button.innerHTML = '<div class="subscribeIcon"></div>' +
    '<span class="subscribeText">' +
    '<div class="subscribeOption subscribe selected" id="SubscribeItemOptionAdd">Download</div>' +
    '</span>';

// append the element after the real subscribe button
if (realButton.nextSibling)
{
    realButton.parentNode.insertBefore(button, realButton.nextSibling);
}
else
{
    realButton.parentNode.appendChild(button);
}