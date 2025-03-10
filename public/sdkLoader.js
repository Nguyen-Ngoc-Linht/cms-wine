(function () {
    window.LoadMobileSdk = function (callback) {
        callback = callback || function () { };
        var startApp = function () {
            XPMobileSDK.onLoad = callback;
            if (XPMobileSDK.isLoaded()) {
                callback();
            }
        }

        if (!window.SDKModuleLoader) {
            let module = document.createElement('script');
            module.addEventListener('load', function () { SDKModuleLoader.call();});
            module.src = '/ModuleLoader.js';
            document.querySelector('head').appendChild(module);
        }

        if ('XPMobileSDK' in window) {
            startApp();
        }
        else {
            script = document.createElement('script');
            script.addEventListener('load', startApp);
            script.src = '/XPMobileSDK.js';

            document.querySelector('head').appendChild(script);
        }
    }();
})();

(function () {
    // Custom Event polyfill
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    if (typeof window.CustomEvent === "function") {
        return;
    }

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();