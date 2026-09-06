// Copyright 2022. Jefferson "jscher2000" Scher. License: MPL-2.0.
// Copyright 2026. Stefan Winopal. Modifications licensed under MPL-2.0.
// version 0.1 - initial concept
// version 1.0 - added toolbar button and keyboard shortcut option
// version 1.1 - added option to choose between toolbar button and address bar button
// version 1.2 - dark mode icon
// version 1.3 - option to decode unicode characters
// version 1.4 - simplify icons, add HTML link format
// version 1.5 - i18n, custom context menu for decoded URLs
// version 1.6 - Manifest V3 (event page), rename to "Copy Link to Page"
// version 1.7 - dynamic menu labels
// version 1.8 - link cleaner support
// version 2.0 - link storage with sidebar, visual feedback on copy

/**** Create and populate data structure ****/

// Show visual feedback on the clicked icon (action or pageAction)
async function showSuccessFeedback(source) {
    try {
        if (source === 'action') {
            // Set success icon for action (toolbar)
            await browser.action.setIcon({
                path: {
                    "16": "icons/checkmark-16.svg",
                    "32": "icons/checkmark-32.svg",
                    "48": "icons/checkmark-48.svg",
                    "64": "icons/checkmark-64.svg"
                }
            });
            
            // Reset to original icon after 1.5 seconds
            setTimeout(async () => {
                await browser.action.setIcon({
                    path: {
                        "16": "icons/link-16.svg",
                        "32": "icons/link-32.svg",
                        "48": "icons/link-48.svg",
                        "64": "icons/link-64.svg"
                    }
                });
            }, 1500);
        } else if (source === 'pageAction') {
            // Get current active tab for pageAction
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                
                // Set success icon for pageAction (address bar)
                await browser.pageAction.setIcon({
                    tabId: tabId,
                    path: {
                        "16": "icons/checkmark-16.svg",
                        "32": "icons/checkmark-32.svg",
                        "48": "icons/checkmark-48.svg",
                        "64": "icons/checkmark-64.svg"
                    }
                });
                
                // Reset to original icon after 1.5 seconds
                setTimeout(async () => {
                    await browser.pageAction.setIcon({
                        tabId: tabId,
                        path: {
                            "16": "icons/link-16.svg",
                            "32": "icons/link-32.svg",
                            "48": "icons/link-48.svg",
                            "64": "icons/link-64.svg"
                        }
                    });
                }, 1500);
            }
        }
    } catch (err) {
        console.log('Error showing feedback:', err.message);
    }
}

/**** Create and populate data structure ****/

// Default starting values
var oPrefs = {
    allpages: true,         // Copy the URL of the page even if it is in the top frame
    allpagesmenu: false,    // Current menu status
    clickplain: 'url',        // Plain click on browser action copies URL only
    clickshift: 'markdown',    // Shift+click on browser action copies markdown
    clickctrl: 'html',        // Shift+click on browser action copies html
    pageaction: false,        // Button in the address bar
    decode: true,           // Option to decode Unicode URLs
    showtabmenu: true,       // Show context menu item for tabs
    cleanLinks: false,       // Clean links (remove tracking parameters) before copying
    amazonId: '',            // Amazon affiliate ID (empty for now, not user-configurable)
    linkStorage: true        // Enable link storage feature (default: on)
};
let pagemenu;
let tabmenu;
let iconpath = 'icons/link-64.svg'; // default path, potentially updated later

// Update oPrefs from storage
async function loadPrefs(){
    try {
        const results = await browser.storage.local.get("prefs");
        if (results.prefs != undefined){
            if (JSON.stringify(results.prefs) != '{}'){
                var arrSavedPrefs = Object.keys(results.prefs)
                for (var j=0; j<arrSavedPrefs.length; j++){
                    oPrefs[arrSavedPrefs[j]] = results.prefs[arrSavedPrefs[j]];
                }
            }
        }
    } catch(err){
        console.log('Error retrieving "prefs" from storage: '+err.message);
    }
}

// Initialize menus and listeners after prefs are loaded
async function init(){
    await loadPrefs();

    if (oPrefs.allpages == true){
        pagemenu = browser.menus.create({
            id: "copy-page-url",
            title: getMenuTitleWithModifiers("menuCopyPageUrlBase"),
            contexts: ["page", "selection"]
        }, function(){ // Optimistic!
            oPrefs.allpagesmenu = true;
        });
    }
    if (oPrefs.pageaction){
        browser.tabs.onUpdated.addListener(showPageAction);
    }
    if (oPrefs.showtabmenu) {
        tabmenu = browser.menus.create({
            id: "copy-tab-url",
            title: getMenuTitleWithModifiers("menuCopyTabUrlBase"),
            contexts: ["tab"]
        });
        oPrefs.tabmenu = true;
    } else {
        // If showtabmenu is false, ensure tab menu is removed
        if (oPrefs.tabmenu === true) {
            browser.menus.remove("copy-tab-url").then(() => {
                oPrefs.tabmenu = false;
            });
        }
    }
    updateButtonTooltips();
    if (oPrefs.allpagesmenu) browser.menus.update("copy-page-url",{title:getMenuTitleWithModifiers("menuCopyPageUrlBase")});
    if (oPrefs.tabmenu) browser.menus.update("copy-tab-url",{title:getMenuTitleWithModifiers("menuCopyTabUrlBase")});
}

/**** Context menu items ****/

let framemenu = browser.menus.create({
    id: "copy-frame-url",
    title: browser.i18n.getMessage("menuCopyFrameUrl"),
    contexts: ["frame"]
});

let linkmenu = browser.menus.create({
    id: "copy-decode-url",
    title: browser.i18n.getMessage("menuCopyDecodeUrl"),
    contexts: ["link"]
});



browser.menus.onClicked.addListener((menuInfo, currTab) => {
    switch (menuInfo.menuItemId) {
        case 'copy-decode-url':
            updateClipboard(cleanAndDeco(menuInfo.linkUrl), menuInfo.linkText, menuInfo.linkUrl);
            break;
        case 'copy-frame-url':
            // Copy to clipboard
            updateClipboard(cleanAndDeco(menuInfo.frameUrl), null, menuInfo.frameUrl);
            break;
        case 'copy-tab-url':
            // Copy tab URL without opening the tab
            // For tab context, currTab is the clicked tab
            if (currTab && currTab.url) {
                // Check for Shift or Ctrl as modifier
                var style = oPrefs.clickplain;
                if (menuInfo.modifiers){
                    if (menuInfo.modifiers.includes('Shift')){
                        style = oPrefs.clickshift;
                    } else if (menuInfo.modifiers.includes('Ctrl')){
                        style = oPrefs.clickctrl;
                    }
                }
                // Set up text for copying
                var cleanUrl = cleanAndDeco(currTab.url);
                if (style == 'html'){
                    var txt = '<a href="' + cleanUrl + '">' + currTab.title + '</a>';
                } else if (style == 'markdown'){
                    var txt = '[' + currTab.title + '](' + cleanUrl + ')';
                } else {
                    txt = cleanUrl;
                }
                updateClipboard(txt, currTab.title, currTab.url);
            }
            break;
        case 'copy-page-url':
            // Check for Shift or Ctrl as modifier
            var style = oPrefs.clickplain;
            if (menuInfo.modifiers){
                if (menuInfo.modifiers.includes('Shift')){
                    style = oPrefs.clickshift;
                } else if (menuInfo.modifiers.includes('Ctrl')){
                    style = oPrefs.clickctrl;
                }
            }
            // Set up text for copying
            var cleanUrl = cleanAndDeco(currTab.url);
            if (style == 'html'){
                var txt = '<a href="' + cleanUrl + '">' + currTab.title + '</a>';
            } else if (style == 'markdown'){
                var txt = '[' + currTab.title + '](' + cleanUrl + ')';
            } else {
                txt = cleanAndDeco(menuInfo.pageUrl);
            }
            updateClipboard(txt, currTab.title, currTab.url);
            break;
        default:
            // WTF?
    }
});

function updateClipboard(txt, title = null, originalUrl = null, source = "action"){
    // Copy to clipboard
    navigator.clipboard.writeText(txt).catch((err) => {
        console.log(browser.i18n.getMessage("errorClipboardWrite", err.message));
    });
    
    // Store link if linkStorage is enabled and we're not in a private window
    if (oPrefs.linkStorage) {
        storeLinkInHistory(txt, title, originalUrl);
    }
    
    // Show visual feedback on the clicked icon
    showSuccessFeedback(source);
}

// Function to check if current window is private
async function isPrivateWindow() {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
            const windowInfo = await browser.windows.get(tabs[0].windowId);
            return windowInfo.incognito || false;
        }
        return false;
    } catch (err) {
        console.log('Error checking private window status:', err.message);
        return false;
    }
}

// Store a link in the link storage history
async function storeLinkInHistory(displayUrl, title, originalUrl) {
    // Don't store in private windows
    const isPrivate = await isPrivateWindow();
    if (isPrivate) {
        return;
    }
    
    try {
        // Get current links from storage
        const result = await browser.storage.local.get('linkStorage');
        const links = result.linkStorage || [];
        
        // Create new link object
        const newLink = {
            id: generateId(),
            url: displayUrl,
            displayUrl: displayUrl,
            originalUrl: originalUrl || displayUrl,
            title: title || '',
            timestamp: Date.now()
        };
        
        // Add to beginning of array (newest first)
        links.unshift(newLink);
        
        // Keep only the last 100 links to prevent storage bloat
        if (links.length > 100) {
            links.pop();
        }
        
        // Save back to storage
        await browser.storage.local.set({ linkStorage: links });
    } catch (err) {
        console.log('Error storing link in history:', err.message);
    }
}

// Generate a unique ID for links
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function deco(urltxt){ // version 1.3
    if (oPrefs.decode == true){
        try {
            return decodeURI(urltxt);
        } catch(err) {
            console.log(err, urltxt);
            return urltxt;
        }
    } else {
        return urltxt;
    }
}

// Clean URL using link-cleaner-js library
function cleanUrl(urltxt) {
    if (oPrefs.cleanLinks == true && urltxt) {
        try {
            // Create settings object for link cleaner
            var settings = {};
            // Add amazonId if set (for future use)
            if (oPrefs.amazonId) {
                settings.amazonId = oPrefs.amazonId;
            }
            var cleaned = linkCleaner.clean(urltxt, settings);
            return cleaned.toString();
        } catch(err) {
            console.log('Error cleaning URL: '+err.message, urltxt);
            return urltxt;
        }
    } else {
        return urltxt;
    }
}

// Combined clean and decode function
function cleanAndDeco(urltxt) {
    return deco(cleanUrl(urltxt));
}

/**** Toolbar button and keyboard shortcut ****/

// MV3: browser_action -> action
browser.action.onClicked.addListener((tab, clickData) => {
    // Check for Shift or Ctrl as modifier
    var style = oPrefs.clickplain;
    if (clickData && clickData.modifiers){
        if (clickData.modifiers.includes('Shift')){
            style = oPrefs.clickshift;
        } else if (clickData.modifiers.includes('Ctrl')){
            style = oPrefs.clickctrl;
        }
    }
    // Set up text for copying
    var cleanUrl = cleanAndDeco(tab.url);
    if (style == 'html'){
        var txt = '<a href="' + cleanUrl + '">' + tab.title + '</a>';
    } else if (style == 'markdown'){
        var txt = '[' + tab.title + '](' + cleanUrl + ')';
    } else {
        txt = cleanUrl;
    }
    updateClipboard(txt, tab.title, tab.url);
});

browser.commands.onCommand.addListener((strName) => {
    if (strName === 'copy-page-url'){
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then((currTab) => {
            updateClipboard(cleanAndDeco(currTab[0].url), currTab[0].title, currTab[0].url);
        }).catch((err) => {
            console.log(err);
        });
    } else if (strName === 'copy-page-url-as-markdown'){
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then((currTab) => {
            var cleanUrl = cleanAndDeco(currTab[0].url);
            updateClipboard('[' + currTab[0].title + '](' + cleanUrl + ')', currTab[0].title, currTab[0].url);
        }).catch((err) => {
            console.log(err);
        });
    } else if (strName === 'copy-page-url-as-html'){ //todo
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then((currTab) => {
            var cleanUrl = cleanAndDeco(currTab[0].url);
            updateClipboard('<a href="' + cleanUrl + '">' + currTab[0].title + '</a>', currTab[0].title, currTab[0].url);
        }).catch((err) => {
            console.log(err);
        });
    }
});

function showPageAction(tabId){
    browser.pageAction.show(tabId);
    browser.pageAction.setIcon({
            tabId: tabId,
            path: {
                64: iconpath
            }
        });
    browser.pageAction.setTitle({
        tabId: tabId,
        title: buttonTitle
    });
}

browser.pageAction.onClicked.addListener((tab, clickData) => {
    // Check for Shift or Ctrl as modifier
    var style = oPrefs.clickplain;
    if (clickData && clickData.modifiers){
        if (clickData.modifiers.includes('Shift')){
            style = oPrefs.clickshift;
        } else if (clickData.modifiers.includes('Ctrl')){
            style = oPrefs.clickctrl;
        }
    }
    // Set up text for copying
    var cleanUrl = cleanAndDeco(tab.url);
    if (style == 'html'){
        var txt = '<a href="' + cleanUrl + '">' + tab.title + '</a>';
    } else if (style == 'markdown'){
        var txt = '[' + tab.title + '](' + cleanUrl + ')';
    } else {
        txt = cleanUrl;
    }
    updateClipboard(txt, tab.title, tab.url, "pageAction");
});

var buttonTitle = '';

function getMenuTitleWithModifiers(baseKey) {
    var p = [browser.i18n.getMessage(baseKey)];
    var sf = oPrefs.clickshift, cf = oPrefs.clickctrl;
    if (sf !== oPrefs.clickplain || cf !== oPrefs.clickplain) {
        var mp = [];
        if (sf !== oPrefs.clickplain) mp.push('⇧: ' + getFormatLabel(sf));
        if (cf !== oPrefs.clickplain && cf !== sf) {
            var ck = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? '⌘' : '⌃';
            mp.push(ck + ': ' + getFormatLabel(cf));
        }
        if (mp.length > 0) p.push('(' + mp.join(', ') + ')');
    }
    return p.join(' ');
}
function getFormatLabel(f) {
    if (f === 'markdown') return browser.i18n.getMessage('formatMarkdownShort');
    if (f === 'html') return browser.i18n.getMessage('formatHtmlShort');
    return browser.i18n.getMessage('formatUrlShort');
}

function updateButtonTooltips(){
    if (oPrefs.cleanLinks) {
        // Use clean tooltips when link cleaning is enabled
        if (oPrefs.clickplain == 'url'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyCleanUrl");
        }
        if (oPrefs.clickplain == 'markdown'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyCleanMarkdown");
        }
        if (oPrefs.clickplain == 'html'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyCleanHtml");
        }
    } else {
        // Use regular tooltips when link cleaning is disabled
        if (oPrefs.clickplain == 'url'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyUrl");
        }
        if (oPrefs.clickplain == 'markdown'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyMarkdown");
        }
        if (oPrefs.clickplain == 'html'){
            buttonTitle = browser.i18n.getMessage("tooltipCopyHtml");
        }
    }
    if (buttonTitle.length > 0){
        // MV3: browserAction -> action
        browser.action.setTitle({
            title: buttonTitle
        });
    }
}

/**** Handle Requests from Options ****/

function handleMessage(request, sender, sendResponse){
    if ("get" in request) {
        // Send oPrefs to Options page
        sendResponse({
            prefs: oPrefs
        });
    } else if ("update" in request) {
        // Receive pref updates from Options page, store to oPrefs, and commit to storage
        var oSettings = request["update"];
        oPrefs.allpages = oSettings.allpages;
        oPrefs.clickplain = oSettings.clickplain;
        oPrefs.clickshift = oSettings.clickshift;
        oPrefs.clickctrl = oSettings.clickctrl;
        oPrefs.decode = oSettings.decode;
        oPrefs.showtabmenu = oSettings.showtabmenu;
        oPrefs.cleanLinks = oSettings.cleanLinks;
        oPrefs.linkStorage = oSettings.linkStorage;
        // amazonId is fixed to 'wnpl-21' and not user-configurable
        // Check for Page Action changes
        if (oSettings.pageaction == true && oPrefs.pageaction == false){
            browser.tabs.onUpdated.addListener(showPageAction);
        } else if (oSettings.pageaction == false && oPrefs.pageaction == true){
            browser.tabs.onUpdated.removeListener(showPageAction);
        }
        oPrefs.pageaction = oSettings.pageaction;
        browser.storage.local.set({prefs: oPrefs})
            .catch((err) => {console.log('Error on browser.storage.local.set(): '+err.message);});
        // Add or remove menu
        if (oPrefs.allpages == true && oPrefs.allpagesmenu == false) {
            browser.menus.create({
                id: "copy-page-url",
                title: getMenuTitleWithModifiers("menuCopyPageUrlBase"),
                contexts: ["page", "selection"]
            }, function(){ // Optimistic!
                oPrefs.allpagesmenu = true;
            });
        } else if (oPrefs.allpages == false && oPrefs.allpagesmenu == true) {
            pagemenu = browser.menus.remove("copy-page-url");
            pagemenu.then(() => {
                oPrefs.allpagesmenu = false;
            });
        }
        // Add or remove tab menu
        if (oPrefs.showtabmenu == true && oPrefs.tabmenu !== true) {
            var tabMenuKey = oPrefs.cleanLinks ? "menuCopyCleanTabUrl" : "menuCopyTabUrlBase";
            tabmenu = browser.menus.create({
                id: "copy-tab-url",
                title: getMenuTitleWithModifiers(tabMenuKey),
                contexts: ["tab"]
            });
            oPrefs.tabmenu = true;
        } else if (oPrefs.showtabmenu == false && oPrefs.tabmenu === true) {
            browser.menus.remove("copy-tab-url").then(() => {
                oPrefs.tabmenu = false;
            });
        }
        // Fix button tooltips
        updateButtonTooltips();
        
        // Update menu titles based on cleanLinks setting
        if (oPrefs.allpagesmenu) {
            var pageMenuKey = oPrefs.cleanLinks ? "menuCopyCleanPageUrl" : "menuCopyPageUrlBase";
            browser.menus.update("copy-page-url", {title: getMenuTitleWithModifiers(pageMenuKey)});
        }
        if (oPrefs.tabmenu) {
            var tabMenuKey = oPrefs.cleanLinks ? "menuCopyCleanTabUrl" : "menuCopyTabUrlBase";
            browser.menus.update("copy-tab-url", {title: getMenuTitleWithModifiers(tabMenuKey)});
        }
        
        // Update frame and link menu titles
        browser.menus.update("copy-frame-url", {title: browser.i18n.getMessage(oPrefs.cleanLinks ? "menuCopyCleanFrameUrl" : "menuCopyFrameUrl")});
        browser.menus.update("copy-decode-url", {title: browser.i18n.getMessage(oPrefs.cleanLinks ? "menuCopyCleanDecodeUrl" : "menuCopyDecodeUrl")});    }
}
browser.runtime.onMessage.addListener(handleMessage);

/**** Initialize (MV3 event page) ****/
init();
