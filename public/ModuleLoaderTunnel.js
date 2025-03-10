var SDKModuleLoaderTunnel = function () {
    let modules = [
        '/LibTunnel/modules/VideoStream/main.js',
        '/LibTunnel/modules/VideoConnection/main.js'
    ];

    modules.forEach((module) => {
        let script = document.createElement('script');
        script.type = "module";
        script.src = module;
        document.querySelector('head').appendChild(script);
    });
};