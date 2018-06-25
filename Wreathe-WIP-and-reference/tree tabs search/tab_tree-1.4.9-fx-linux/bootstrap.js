/*
 * This file is part of Tab Tree,
 * Copyright (C) 2015-2016 Sergey Zelentsov <crayfishexterminator@gmail.com>
 * Edited 2017May08 by @ethus3h
 */

'use strict';
/* jshint moz:true */
/* global Components, CustomizableUI, Services, SessionStore, APP_SHUTDOWN, ShortcutUtils, NavBarHeight, AddonManager */

//const {classes: Cc, interfaces: Ci, utils: Cu} = Components; // WebStorm inspector doesn't understand destructuring assignment
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/ShortcutUtils.jsm");
Cu.import("resource:///modules/CustomizableUI.jsm");
Cu.import("resource://gre/modules/AddonManager.jsm");
var ssHack = Cu.import("resource:///modules/sessionstore/SessionStore.jsm");
var ssOrig;
const ss = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
var stringBundle = Services.strings.createBundle('chrome://tabtree/locale/global.properties?' + Math.random()); // Randomize URI to work around bug 719376
const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});

//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
function startup(data, reason)
{
	windowListener.register();
}

//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
function shutdown(data, reason)
{
	return;
}

//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
function install(aData, aReason) { }
//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
function uninstall(aData, aReason) { }

//noinspection JSUnusedGlobalSymbols
var windowListener = {
	
	onOpenWindow: function (aXULWindow) {
		// In Gecko 7.0 nsIDOMWindow2 has been merged into nsIDOMWindow interface.
		// In Gecko 8.0 nsIDOMStorageWindow and nsIDOMWindowInternal have been merged into nsIDOMWindow interface.
		// Since ≈FF50 "Use of nsIDOMWindowInternal is deprecated. Use nsIDOMWindow instead."
		let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		aDOMWindow.addEventListener('tt-TabsLoad', function onTabsLoad(event) {
			aDOMWindow.removeEventListener('tt-TabsLoad', onTabsLoad, false);
			
			windowListener.loadIntoWindow(aDOMWindow);
		}, false);
	},
	
	loadIntoWindow: function (aXULWindow) {
		// In Gecko 7.0 nsIDOMWindow2 has been merged into nsIDOMWindow interface.
		// In Gecko 8.0 nsIDOMStorageWindow and nsIDOMWindowInternal have been merged into nsIDOMWindow interface.
		// Since ≈FF50 "Use of nsIDOMWindowInternal is deprecated. Use nsIDOMWindow instead."
		let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		if (!aDOMWindow) {
			return;
		}
		let browser = aDOMWindow.document.querySelector('#browser');
		if (!browser) {
			return;
		}
		let sidebar = aDOMWindow.document.querySelector('#tabbrowser-tabs');
		let g = aDOMWindow.gBrowser;
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////// QUICK SEARCH BOX ////////////////////////////////////////////////////////////////////////
		let quickSearchBox = aDOMWindow.document.createElement('textbox');
		quickSearchBox.id = 'tt-quicksearchbox';
		quickSearchBox.setAttribute('placeholder', stringBundle.GetStringFromName('tabs_quick_search'));
		switch (Services.prefs.getIntPref('extensions.tabtree.search-position')) {
		case 1:
			sidebar.insertBefore(quickSearchBox, newTabContainer); // before "New tab" button
			break;
		case 2:
			sidebar.appendChild(quickSearchBox); // after "New tab" button
			break;
		default: // case 0 // at the top
			sidebar.insertBefore(quickSearchBox, sidebar.firstChild);
		}
		quickSearchBox.collapsed = Services.prefs.getBoolPref('extensions.tabtree.search-autohide');

        quickSearch: function(aText, tPos) {
            // I assume that this method is never invoked with aText=''
            // g.browsers[tPos].contentDocument.URL doesn't work anymore because contentDocument is null
            let url = g.browsers[tPos].documentURI.spec || g.browsers[tPos]._userTypedValue || '';
            let txt = aText.toLowerCase();
            if (g.tabs[tPos].label.toLowerCase().indexOf(txt)!=-1 || url.toLowerCase().indexOf(txt)!=-1) { // 'url.toLowerCase()' may be replaced by 'url'
                return true;
            }
        }

            quickSearchBox.addEventListener('input', function(event) {
            let txt = quickSearchBox.value.toLowerCase();
            if (txt.length >= Services.prefs.getIntPref('extensions.tabtree.search-jump-min-chars')) {
                for (let tPos = g._numPinnedTabs; tPos < g.tabs.length; ++tPos) {
                    let url = g.browsers[tPos]._userTypedValue || g.browsers[tPos].contentDocument.URL || '';
                    // 'url.toLowerCase()' may be replaced by 'url':
                    if (g.tabs[tPos].label.toLowerCase().indexOf(txt) != -1 || url.toLowerCase().indexOf(txt) != -1) {
                        g.selectTabAtIndex(tPos);
                        quickSearchBox.focus();
                        break;
                    }
                }
            }
		}, false);

        // <Enter> in quick search box = jump to first tab matching quick search
		quickSearchBox.onkeydown = function(keyboardEvent) {
			if (keyboardEvent.key=='Enter') {
				for (let tPos = g._numPinnedTabs; tPos < g.tabs.length; ++tPos) {
					if (tt.quickSearch(quickSearchBox.value, tPos)) {
						g.selectTabAtIndex(tPos);
						quickSearchBox.focus();
						break;
					}
				}
			}
			if (keyboardEvent.key=='Enter' || keyboardEvent.key=='Escape') {
                quickSearchBox.value = '';
                tree.treeBoxObject.invalidate();
			}
		};
	} // loadIntoWindow: function(aDOMWindow)
}; // var windowListener =
