; (function (undefined) {
    var audioParser = function (data) {
        var self = this;

        XPMobileSDKTunnel.library.ItemHeaderParser.call(self, data);

        /**
         * Parse audio frame headers
         */
        function parseAudioHeader() {
            self.uuid = self.getGUID();
            
            self.skipBytes(18);

            var mainHeader = self.readBytes(2);

            self.skipBytes(4);

            if (mainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionDynamicInfo) {
                self.parseDynamicInformation();
            }
        };

        /**
         * Initialize the prototype
         */
        function initialize() {
            parseAudioHeader();
        }

        initialize();
    };

    XPMobileSDKTunnel.library.AudioHeaderParser = audioParser;
})();