// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
Browser = {
    // Opera 8.0+
    isOpera: function() {
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    },

    // Firefox 1.0+
    isFirefox: function() {
        return typeof InstallTrigger !== 'undefined';
    },

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    isSafari: function() {
        return isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    },

    // Internet Explorer 6-11
    isIE: function() {
        return !!document.documentMode;
    },
    // Edge 20+
    isEdge: function() {
        return !isIE && !!window.StyleMedia;
    },

    // Chrome 1+
    isChrome: function() {
        return !!window.chrome && !!window.chrome.webstore;
    },
};

Template.errorHelp.helpers({
    browserHelp() {
        var browser = "default";
        if (Browser.isFirefox()) {
            browser="firefox";
        } else if (Browser.isChrome()) {
            browser="chrome";
        }
        return browser + "Help";
    }
});
