GMO.Push = {
	init: function(){
		console.log('push init');
		GMO.Push.requestPush();
	},
	
	requestPush: function(){
		var server = "http://cpptl.co:3000";
		//$('body').prepend('<div id="debug"></div>');
		//var $debug = $('#debug');
		//console.log('requestPush: ' + server);
		
		var settings = {};
		var userId = device.uuid;
		userId = AppData.UserId;
		var sendTokenToServer = function sendTokenToServer(token) {
			/*
			if(onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###sendTokenToServer");
			}
			*/
			$.ajax(server + "/registerDevice", {
				type: "post",
				dataType: 'json',
				data: JSON.stringify({ //JSON object with token and the device platform
					token: token,
					platform: 'IOS',
					project_id: 'rc-gmo',
					user_id:userId,
					settings:settings
				}),
				success: function(response) {
					if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
						console.log('<li>Successfully registered device: ' + token + '</li>');
						console.log("###Successfully registered device.");
					}
				}
			});
		}
		
		var addCallback = function addCallback(key, callback) {
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###addCallback");
			}
			if (window.pushCallbacks === undefined) {
				window.pushCallbacks = {}
			}
			window.pushCallbacks[key] = callback;
		};
		var pushNotification = window.plugins.pushNotification;
		var apnSuccessfulRegistration = function(token) {
			var tokenVal = token.toString(16);
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###apnSuccessfulRegistration");
				console.log('<li>Success: ' + tokenVal + '</li>');
			}
			sendTokenToServer(tokenVal);
			addCallback('onNotificationAPN', onNotificationAPN);
		}
		var apnFailedRegistration = function(error) {
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###apnFailedRegistration");
			}
			alert("Error: " + error.toString());
		}
	
		
		
		
		
		var apnSuccessfulRegistrationAndroid = function(token) {
			var tokenVal = token.toString(16);
			//alert('Android token: ' + tokenVal); 
			sendTokenToServerAndroid(tokenVal);
			addCallback('onNotificationGCM', onNotificationGCMAndroid);
		}
		var apnFailedRegistrationAndroid = function(error) {
			alert('Android error: ' + error);
		}
	
		var onNotificationGCMAndroid = function(e) {
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###onNotificationGCMAndroid");
			}
			if( navigator.notification ){
				console.log(e);
				if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
					console.log('<li>Message Content</li>');
					console.log('<li>' + e + '</li>');
				}
				navigator.notification.alert(e.body, null, 'GMO', 'Close');
			}
			else {
				alert( e.body );
			}
		};
		var sendTokenToServerAndroid = function sendTokenToServer(token) {
			/*
			if(onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###sendTokenToServer");
			}
			*/
			$.ajax(server + "/registerDevice", {
				type: "post",
				dataType: 'json',
				data: JSON.stringify({ //JSON object with token and the device platform
					token: token,
					platform: 'IOS',
					project_id: 'rc-gmo',
					user_id:userId,
					settings:settings
				}),
				success: function(response) {
					if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
						console.log('<li>Successfully registered device: ' + token + '</li>');
						console.log("###Successfully registered device.");
					}
				}
			});
		}
		
		
		
		
		
		//the function is a callback when we receive notification from APN
		var onNotificationAPN = function(e) {
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###onNotificationAPN");
			}
			if( navigator.notification ){
				console.log(e);
				if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
					console.log('<li>Message Content</li>');
					console.log('<li>' + e + '</li>');
				}
				navigator.notification.alert(e.body, null, 'GMO', 'Close');
			}
			else {
				alert( e.body );
			}
		};
		//alert(device.platform);
		//device = {platform:'iOS'};
		if(typeof(device)!='undefined'){
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###device exists");
			}
			if(typeof(device.platform)!='undefined'){
				if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
					console.log("###device.platform exists");
				}
				if (device.platform == 'android' || device.platform == 'Android') {
					if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
						console.log('<li>registering android</li>');
					}
					pushNotification.register(apnSuccessfulRegistrationAndroid, apnFailedRegistrationAndroid, {
						"senderID":"AIzaSyC31Vs7pLaQQ6Fb89HWgtdOifk_3rLSHFc",
						"ecb":"onNotificationGCM"
					});		// required!
				}
				else {
					if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
						console.log('<li>registering iOS</li>');
					}
					pushNotification.register(apnSuccessfulRegistration, apnFailedRegistration,{
						"badge": "true",
						"sound": "true",
						"alert": "true",
						"ecb": "onNotificationAPN"
					});
				}
			}
		}
		else{
			if(1==1){//onlineForLife.App.isDevUser(AppData.config.push.testUsers)){
				console.log("###device DOES NOT exist");
			}
		}
	}
	
	
};

