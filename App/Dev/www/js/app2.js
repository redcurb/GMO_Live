var GMO = window.GMO || {};
GMO.App = GMO.App || {};
GMO.Globe = GMO.Globe || {};
GMO.Tracking = GMO.Tracking || {};
GMO.Push = GMO.Push || {};
window.AppData = {};
window.AppData.timestamp = new Date().getTime();
GMO.App = {
	init: function(){
		AppData.TestMode=false;
		AppData.DesktopMode=false;
		
		if(Redcurb.Helpers.getParameterByName('testmode')=="true"){
			AppData.TestMode = true;
			$('#deviceProperties').show();
		}
		if(Redcurb.Helpers.getParameterByName('desktop')=="true"){
			AppData.DesktopMode = true;
			window.device = {
			  "platform" : "iOS",
			  "available" : true,
			  "model" : "iPhone5,1",
			  "cordova" : "3.0.0",
			  "version" : "7.0.4",
			  "uuid" : "2B586BFA-6BA9-4D55-BA5B-47D627541927"
			};
		}	
		if(typeof(device)=='undefined'){
			device = {};
			device.uuid = window.AppData.timestamp;
		}
		GMO.App.getAppData();
		GMO.Push.init();
	},

	checkLoginStatus:function(){
		var loggedIn = false;
		//loggedIn = true;
		var dbUrl = 'https://gmocalc.firebaseio.com/users/' + device.uuid;
		var appData = new Firebase(dbUrl);
		appData.once('value', function(snapshot) {
			console.log('UUID');
			console.log(snapshot==null);
			console.log(snapshot.val()==null);

			if(snapshot.val()!=null){
				var data = snapshot.val();
				if(typeof(data.UserInfo)!='undefined'){
					loggedIn = true;
				}
				
			}


			AppData.UserData = {};
			AppData.UserData.FormData = {};
			AppData.UserData.UserInfo = {name:'',email:'',phone:''};
			GMO.App.sendUserData('init');
			
			if(loggedIn){
				
			}
			else{
				GMO.App.setupLoginOverlay();
			}



		});



	},	

	setupLoginOverlay:function(){
		$('#page-login').get(0).addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
		$('#screen-login').get(0).addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var paddingPercent = 13;
		paddingPercent = paddingPercent/100;
		var paddingWidth = windowWidth * paddingPercent;
		var paddingHeight = paddingWidth;
		var overlayWidth = windowWidth - (paddingWidth*2);
		var overlayHeight = windowHeight - (paddingHeight*2);
		
		var top = overlayWidth * .45;
		console.log('paddingPercent: ' + paddingPercent);
		console.log('paddingWidth: ' + paddingWidth);
		console.log('paddingHeight: ' + paddingHeight);
		console.log('overlayWidth: ' + overlayWidth);
		console.log('overlayHeight: ' + overlayHeight);
		
		
		$('#page-login').css({
			left: paddingWidth + 'px',
			top: top + 'px',
			width: overlayWidth + 'px'
		});
		GMO.App.setupLoginForm();
	},	

	setupLoginForm:function(){
		$('#page-login,#screen-login').show();
		
		$('#form-login').on('submit',function(event){
			event.preventDefault();
			GMO.App.handleLoginFormSubmit();
			return false;
		});
		$('#form-login input').on('focus',function(event){
			$(this).removeClass('valid-false');
		});
	},	

	handleLoginFormSubmit:function(){
		var formValid = true;
		var $form = $('#form-login');
		var $name = $form.find('#login-name');
		var $email = $form.find('#login-email');
		var $phone = $form.find('#login-phone');
		var nameVal = $name.val();
		var emailVal = $email.val();
		var phoneVal = $phone.val();
		var regexFirstName = /^[A-Za-z]*\s{1}[A-Za-z]*$/;
		var regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		//var regexPhone = /.{9,9}/;
		
		if(!regexFirstName.test(nameVal)){
			$form.addClass('valid-false');
			$name.addClass('valid-false');
			formValid = false;
		}
		else{
			$name.removeClass('valid-false');
		}	
		if(!regexEmail.test(emailVal)){
			$form.addClass('valid-false');
			$email.addClass('valid-false');
			formValid = false;
		}
		else{
			$email.removeClass('valid-false');
		}	
		if(emailVal=='' && phoneVal==''){
			$form.addClass('valid-false');
			$email.addClass('valid-false');
			$phone.addClass('valid-false');
			formValid = false;
		}
		else{
			$phone.removeClass('valid-false');
		}	
		
		AppData.UserData.UserInfo.name = nameVal;
		AppData.UserData.UserInfo.email = emailVal;
		AppData.UserData.UserInfo.phone = phoneVal;
		if(formValid){
			GMO.App.handleLoginSuccess();
		}
		else{
			//alert('Please fill out the form');
		}
	},	

	dismissOverlay:function(){
		$('#page-login,#screen-login').hide();
	},	

	handleLoginSuccess:function(){
		//alert('handleLoginSuccess');
		GMO.App.dismissOverlay();
		GMO.App.sendUserData('form');
	},	

	sendUserData:function(method){
		if(typeof(device)=='undefined'){
			device = {};
			device.uuid = window.AppData.timestamp;
		}
		console.log(device.uuid);
		AppData.UserData[device.uuid] = {};		
		AppData.UserData[device.uuid].device = device;

		var dbUrl = 'https://gmocalc.firebaseio.com/users/'+device.uuid;
		var appData = new Firebase(dbUrl);
		if(method=='form'){
			appData.child('UserInfo').set(AppData.UserData.UserInfo);
		}
		else{
			appData.child('access').push(AppData.UserData[device.uuid]);
			appData.child('accessCount').transaction(function(current_value) {
				return current_value + 1;
			});
		}
		appData.child('device').set(AppData.UserData[device.uuid].device);



		console.log(device);
	},	

	setupStatsSocket:function(){
		var $statsGospel = $('ul.stats .stats-gospel .stats-value');
		var $statsDecisions = $('ul.stats .stats-decisions .stats-value');
		var $statsConnections = $('ul.stats .stats-connections .stats-value');
		
		require(["http://stage.greatcommission2020.com/js/common.js"], function() {
			require(["counters", "api"], function(Counters, Api) {
				
				console.log('require');
				// Counters
				var counters = new Counters({
					gospel: $statsGospel,
					decision: $statsDecisions,
					discipleship: $statsConnections
				});
			
				// Socket
				Api.createCountersSocket("jonFrendlAppMap", counters).on("visit", onVisit);
			
				function onVisit(visitor) {
					// do stuff here
					//console.log(visitor);
					var data = {};
					
					data.longitude = visitor.longitude;
					data.latitude = visitor.latitude;
					data.type = visitor.type;
					data.newGospel = visitor.newGospel;
					data.newDecision = visitor.newDecision;
					data.newConnection = visitor.newConnection;
					
					
					GMO.Globe.handleNewSocketItem(data);
				};
				GMO.Globe.showNextPoint();
			});
		});
	},	

	setupListeners:function(){
		//document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);
		$(document).on("AppDataLoaded", GMO.App.setupApp);
		document.addEventListener("deviceready", GMO.App.onDeviceReady, false);
	},	

	onDeviceReady:function(){
		alert('ready');
		var element = document.getElementById('deviceProperties');
		element.innerHTML = 'Device Name: '     + device.name     + '<br />' + 
							'Device PhoneGap: ' + device.phonegap + '<br />' + 
							'Device Platform: ' + device.platform + '<br />' + 
							'Device UUID: '     + device.uuid     + '<br />' + 
							'Device Version: '  + device.version  + '<br />';
		GMO.App.init();
	},	

	setupApp:function(){
		console.log('}}}}}}}}}}}}}}}}}} setupApp');
		GMO.Globe.init();
		GMO.App.buildStats();
		GMO.App.setupHandlers();
		GMO.App.setupStatsSocket();
		GMO.Share.init();
		if(AppData.App.config.login.enabled){
			GMO.App.checkLoginStatus();
		}
	},	

	buildStats:function(){
		var $gospelValue = $('.stats-gospel .stats-value');
		var $decisionsValue = $('.stats-decisions .stats-value');
		var $connectionsValue = $('.stats-connections .stats-value');
		
	},	

	setupHandlers:function(){
		$(window).resize(function() {
			GMO.App.handleResize();
		});
		
		$('#calculatorInput').on('keyup',function(e){
			GMO.App.handleInputChange($(this));
		});
		$('#calculatorInput').on('focus',function(e){
			GMO.App.resetInput($(this));
		});
		$('#link-skip').on('click',function(){
			GMO.App.dismissOverlay();
			return false;
		});
		
		GMO.App.setDefaultInput();
	},	

	getAppData:function(){
		var dbUrl = 'https://gmocalc.firebaseio.com/app/';
		var appData = new Firebase(dbUrl);
		appData.once('value', function(snapshot) {
			appData = snapshot.val();
			AppData.App = appData;
			console.log(appData);
			$(document).trigger({type:'AppDataLoaded'});
		});
	},

	setDefaultInput:function(){
		GMO.App.handleInputChange($('#calculatorInput').val(100000));
	},
	
	resetInput:function(){
		$('#calculatorInput').val('')
	},
	
	handleInputChange:function($input){
		//console.log('handleFormChange');
		var $form = $('.form-calculator');
		var $result = $form.find('#calculatorResult');
		
		var inputVal = $input.val().replace('$','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','');
		//console.log('TYPE inputVal 1: ',typeof(inputVal));
		//console.log('inputVal 1: ',inputVal);
		if(inputVal==''){
			//console.log('inputVal ==""');
			inputVal=0;
		}
		else{
			//console.log('inputVal ELSE');
			inputVal = parseInt(inputVal);
		}
		//console.log('TYPE inputVal 2: ',typeof(inputVal));
		//console.log('inputVal 2: ',inputVal);
		$input.data('inputVal',inputVal);
		var formattedVal = inputVal;
		formattedVal = formattedVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		//console.log('formattedVal 1: ',formattedVal);
		formattedVal = '$'+formattedVal;
		//console.log('formattedVal 2: ',formattedVal);
		
		var test = false;
		
		if(test){
			var string = inputVal.toString();
			var len = string.length;
			var string1 = '';
			var string2 = '';
			var string3 = '';
			var string4 = '';
			var string5 = '';
			var output = '';
			if(len==4){
				string1 = string.substring(0,1);
				string2 = string.substring(1,4);
				output = string1 +','+ string2;
			}
			else if(len==5){
				string1 = string.substring(0,2);
				string2 = string.substring(2,5);
				output = string1 +','+ string2;
			}
			else if(len==6){
				string1 = string.substring(0,3);
				string2 = string.substring(3,6);
				output = string1 +','+ string2;
			}
			else{
				output = string;
			}
			//console.log('string: ' + string);
			//console.log('string1: ' + string1);
			//console.log('string2: ' + string2);
			//console.log('len: ' + len);
			//console.log('output: ' + output);
		}	
		
		
		$input.val(formattedVal);
		//$input.val(output);
		var multiplier = AppData.App.config.calculator.multiplier;
		var calcResult = inputVal*multiplier;
		calcResult = calcResult.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'+';
		$result.val(calcResult);
		//console.log('calcResult 1: ',calcResult);
		//toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		//oninput="calculatorResult.value='$' + (parseInt(calculatorInput.value) * 20).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'+';"
	},

	handleResize:function(){
		GMO.Globe.setupGlobe();
	}
	
};
$(function() {
	GMO.App.setupListeners();
	if(Redcurb.Helpers.getParameterByName('testmode')=="true"){
		//GMO.App.init();
	}
});
