if (typeof console === "undefined"
    || typeof console.log === "undefined"
    || typeof console.info === "undefined"
    || typeof console.error === "undefined"
    || typeof console.warn === "undefined"
    || !XPMobileSDKSettingsTunnel.EnableConsoleLog) {
    console = {};
    console.log = function () { };
    console.info = function () { };
    console.error = function () { };
    console.warn = function () { };
} else if (XPMobileSDKSettingsTunnel.EnableConsoleLog === "error") {
    console.log = function () { };
    console.info = function () { };
    console.warn = function () { };
} else if (XPMobileSDKSettingsTunnel.EnableConsoleLog === "warn") {
    console.log = function () { };
    console.info = function () { };
}