; (function (undefined) {
    var videoParser = function (data) {
        var self = this;

        XPMobileSDKTunnel.library.ItemHeaderParser.call(self, data);

        /**
         * Get motion amount information 
         */
        self.parseMotionInformation = function () {
            self.motionHeaderSize = readBytes(4);
            self.motionAmount = readBytes(4);
        };

        /**
         * Encode the data using Blob
         */
        self.convertToImage = function () {
            self.type = XPMobileSDKTunnel.library.ItemHeaderParser.Type.Frame;
            self.blob = new Blob([self.data], { type: 'image/jpeg' });
        };

        /**
         * Get carousel information
         */
        self.parseCarouselInfo = function () {
            self.carousel = {};
            self.carousel.headerSize = readBytes(4);
            self.carousel.headerVesion = readBytes(4);
            self.carousel.itemId = getGUID();
        };

        /**
         * Parse video frame headers
         */
        function parseHeader() {  
            self.uuid = self.getGUID();

            self.timestamp = new Date(self.readBytes(8));
            self.frameNumber = self.readBytes(4);
            self.dataSize = self.readBytes(4);
            self.headerSize = self.readBytes(2);

            var MainHeader = self.readBytes(2);
            
            self.hasSizeInformation = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionSize;
            self.hasLiveInformation = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionLiveEvents;
            self.hasPlaybackInformation = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionPlaybackEvents;
            self.hasNativeData = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionNative;
            self.hasMotionInformation = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionMotionEvents;
            self.hasLocationData = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionLocationInfo;
            self.hasStreamInfo = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionStreamInfo;
            self.hasCarouselInfo = MainHeader & XPMobileSDKTunnel.library.ItemHeaderParser.HeaderExtensionCarouselInfo;
            
            if (self.hasSizeInformation) {
                self.parseSizeInformation();
            }

            if (self.hasLiveInformation) {
                self.parseLiveInformation();
            }
            if (self.hasPlaybackInformation) {
                self.parsePlaybackInformation();
            }
            if (self.hasNativeData) {
                self.readBytes(readBytes(4)); // Remove this by header parser when we have support for Native data
            }
            if (self.hasMotionInformation) {
                self.parseMotionInformation();
            }
            if (self.hasLocationData) {
                self.readBytes(readBytes(4)); // Remove this by header parser when we have support for Stream location
            }
            if (self.hasStreamInfo) {
                self.parseStreamInfo();
            }
            if (self.hasCarouselInfo) {
                self.parseCarouselInfo();
            }
        }

        /**
        * Called to get the video data from the binary
        *
        * @param dataView, binary, video data
        */
        function getData() {
            if (self.dataSize <= 0) {
                return;
            }

            self.retrieveData();

            if (self.stream) {
                switch (self.stream.dataType) {
                    case 'JPEG': self.convertToImage(); break;
                }
            }
            else {
                self.convertToImage();
            }
        }

        /**
         * Initialize the prototype
         */
        function initialize() {
            parseHeader();
            getData();
        }

        initialize();
    };

    XPMobileSDKTunnel.library.VideoHeaderParser = videoParser;
})();