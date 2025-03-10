XPMobileSDKTunnel.library.VideoPushConnection = function (successCallback, errorCallback, skipUserMedia) {
	
	this.open = open;
	this.close = close;
	this.send = send;
	this.destroy = destroy;
	this.isOpen = isOpen;
	this.getMediaStream = getMediaStream;

	var self = this;
	var headerSize = 36;
	var counter = 0;
	
	var callbacks = {
		onSuccess: function (videoPushConnection) {},
		onError: function (error) {},
		onStreamSuccess: function (videoPushConnection) {},
		onStreamError: function (error) {}
	};
	
	var stream, streamRequest, mediaStream;
	
	initialize();
	
	
	function initialize() {
		
		callbacks.onSuccess = successCallback || callbacks.onSuccess;
		callbacks.onError = errorCallback || callbacks.onError;

		if (skipUserMedia) {
		    callbacks.onSuccess(self);

		    return;
		}

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(onSuccess).catch(onError);
		}
		else {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if (navigator.getUserMedia) {
				navigator.getUserMedia({ video: true, audio: false }, onSuccess, onError);
			}
			else {
				console.warn("Video push not supported!");
			}				
		}
		
		function onSuccess(userMediaStream) {
			
			mediaStream = userMediaStream;
			callbacks.onSuccess(self);			
		}
		
		function onError(error) {
		    console.error(error.name);
			callbacks.onError(error);	
		}
	}
	
	function getMediaStream() {

		return mediaStream;
	}
	
	function open(successCallback, errorCallback) {

		callbacks.onStreamSuccess = successCallback || callbacks.onStreamSuccess;
		callbacks.onStreamError = errorCallback || callbacks.onStreamError;
		
		if (isOpen()) return;

		streamRequest = XPMobileSDKTunnel.requestPushStream(streamRequestCallback);		
	}
	
	function close() {

		if (!isOpen()) return;

		if (streamRequest) {
		    XPMobileSDKTunnel.cancelRequest(streamRequest);
			streamRequest = null;
		}
		if (stream) {
		    XPMobileSDKTunnel.closeStream(stream.videoId);
			stream = null;
		}		
	}
	
	function streamRequestCallback(parameters, error) {
		
		streamRequest = null;

		if (!parameters) {
			callbacks.onStreamError(error);
			return;
		}
		
		stream = parameters;
		callbacks.onStreamSuccess(self);
	}
	
	function isOpen() {
		return stream || streamRequest;
	}
	
	function send(base64EncodedImage) {
		
		var bytesArray = XPMobileSDKTunnel.library.Bytes.fromBase64(base64EncodedImage);
		
		var buffer = new ArrayBuffer(headerSize + bytesArray.length);
		var bufferView = new Uint8Array(buffer);
		
		// Header
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromGuid(stream.videoId, 16));				// Video id
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromInt(new Date().getTime(), 8), 16);		// Timestamp
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromInt(++counter, 4), 24);				// Frame count
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromInt(bytesArray.length, 4), 28);		// Frame size in bytes
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromInt(headerSize, 2), 32);				// Header size in bytes
		bufferView.set(XPMobileSDKTunnel.library.Bytes.fromInt(0, 2), 34);						// Header extension flags
		// Data
		bufferView.set(bytesArray, headerSize);
				
		var url = XPMobileSDKSettingsTunnel.MobileServerURL + XPMobileSDKSettingsTunnel.videoChanel + '/' + stream.videoId + '/';
		var parameters = {
			method: 'post',
			contentType: 'arraybuffer', 
			postBody: buffer,
			onLoading: onAjaxLoading,
			onSuccess: onAjaxSuccess,
			onFailure: onAjaxFailure
		};
		
		var ajaxRequest = new XPMobileSDKTunnel.library.Ajax.Request(url, parameters);		
	}
	
	function onAjaxLoading(request) {}
	
	function onAjaxSuccess(request) {}
	
	function onAjaxFailure(request) {
		console.error('ERROR in ajax request for video push with videoId ' + stream.videoId);		
	}
	
	function destroy() {
		
		close();

		if (!mediaStream) return;
		
		mediaStream.getTracks().forEach(function (track) {
			track.stop();
		});
		mediaStream = null;		
	}	
};
