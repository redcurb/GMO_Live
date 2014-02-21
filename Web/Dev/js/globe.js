GMO.Globe = {
	init: function(){
		GMO.Globe.buildGlobeData();
	},	

	getPxPosition: function(lat,lon){
		//console.log('               ');
		//console.log('============================ getPxPosition: ' + lat + ' - ' + lon);
		var scale = AppData.globeData.scale;		//0.5555555555555556
		var mapWidth = AppData.globeData.width;		//3400
		var mapHeight = AppData.globeData.height;	//900
		
		
		var pxLonOffset = lon * AppData.globeData.pxPerDegreeLon;
		var pxLatOffset = -(lat * AppData.globeData.pxPerDegreeLat);
		var pxLonPos = (pxLonOffset + AppData.globeData.zeroDegreesLon);
		var pxLatPos = (pxLatOffset + AppData.globeData.zeroDegreesLat);
		var pxLonPosScaled = pxLonPos * scale;
		var pxLatPosScaled = pxLatPos * scale;
		
		//console.log('lat: ' + lat);
		//console.log('lon: ' + lon);
		//console.log('scale: ' + scale);
		//console.log('mapWidth: ' + mapWidth);
		//console.log('mapHeight: ' + mapHeight);
		//console.log('pxLon: ' + pxLonOffset);
		//console.log('pxLat: ' + pxLatOffset);
		//console.log('pxLonPos: ' + pxLonPos);
		//console.log('pxLatPos: ' + pxLatPos);
		//console.log('pxLonPosScaled: ' + pxLonPosScaled);
		//console.log('pxLatPosScaled: ' + pxLatPosScaled);

		
		posData = {};
		posData.left1 = pxLonPosScaled;
		posData.top1 = pxLatPosScaled;
		posData.left2 = pxLonPosScaled + AppData.globeData.map2OffsetLon;
		posData.top2 = pxLatPosScaled + AppData.globeData.map2OffsetLat;
		//console.log('left1: ' + posData.left1);
		//console.log('top1: ' + posData.top1);
		//console.log('left2: ' + posData.left2);
		//console.log('top2: ' + posData.top2);
		//console.log('               ');
		return posData;
	},

	buildPointsHtmlAll: function(){
		//console.log('               ');
		//console.log('============================ buildPointsHtmlAll');
		var pointsHtml = '';
		var pointsData = AppData.MapPoints.points;
		var max = 99;
		var i = 0;
		$.each(pointsData,function(key,data){
		//	if(i<=max){
				i++;
				//console.log(data);
				var lastId = AppData.globeData.mapPoints.lastId;
				var lat = data.a;
				var lon = data.o;
				var type = data.t;
				var posData = GMO.Globe.getPxPosition(lat,lon);
				var left1 = posData.left1;
				var left2 = posData.left2;
				var top1 = posData.top1;
				var top2 = posData.top2;
				var iClass = 'displayed-false type-' + type;
				var map1Id = 'item1-' + lastId;
				var map2Id = 'item2-' + lastId;
				
				AppData.globeData.mapPoints.itemsToShow.push(lastId);
				pointsHtml += '<i id="' + map1Id + '" style="left:' + left1 + 'px;top:' + top1 + 'px;" class="' + iClass + '"></i><i id="' + map1Id + '" style="left:' + left2 + 'px;top:' + top2 + 'px;" class="' + iClass + '"></i>';
				AppData.globeData.mapPoints.lastId += 1;
		//	}
		});
	},

	handleNewSocketItem:function(data){
		var max = 20;
		//if(AppData.globeData.mapPoints.itemsCounter<max){


//			AppData.globeData.mapPoints.itemsToShow.push(AppData.globeData.mapPoints.itemsCounter);

			var pointHtml = '';
			var lon = data.longitude;
			var lat = data.latitude;
			var posData = GMO.Globe.getPxPosition(lat,lon);
			var left1 = posData.left1;
			var left2 = posData.left2;
			var top1 = posData.top1;
			var top2 = posData.top2;

			var type = data.type.replace(' ','');
			var typeClass = 'type-0';
			if(data.newGospel || type=='gospel'){
				typeClass = 'type-1';
			}
			else if(data.newDecision || type=='decision'){
				typeClass = 'type-2';
			}
			else if(data.newConnection || type=='discipleship'){
				typeClass = 'type-3';
			}
			var iClass = 'displayed-false ' + typeClass;
			var currentId = AppData.globeData.mapPoints.itemsCounter;
			
			var map1Id = 'item1-' + currentId;
			var map2Id = 'item2-' + currentId;
		
			AppData.globeData.mapPoints.itemsToShow.push(currentId);
			
			pointHtml += '<i data-longitude="' + lon + '" data-latitude="' + lat + '" id="' + map1Id + '" style="left:' + left1 + 'px;top:' + top1 + 'px;" class="' + iClass + '"></i><i data-longitude="' + lon + '" data-latitude="' + lat + '" id="' + map1Id + '" style="left:' + left2 + 'px;top:' + top2 + 'px;" class="' + iClass + '"></i>';
			
			$('.map-points-container').append(pointHtml);
			
			/*
			console.log('lon: ' + lon);
			console.log('lat: ' + lat);
			console.log('type: |' + type + '|');
			console.log('typeClass: ' + typeClass);
			console.log(' ');
			*/
			AppData.globeData.mapPoints.itemsCounter++;
		//}
	},	

	showNextPoint: function(){
		var $mapPoints = $('.map-points-foreground');
		var id = AppData.globeData.mapPoints.itemsToShow[0];
		
		var $i = $mapPoints.find('#item1-' + id + ', #item2-' + id);
		setTimeout(function() {
			//$i.css('outline','3px solid green').removeClass('displayed-false');
			$i.removeClass('displayed-false');
			AppData.globeData.mapPoints.itemsToShow.splice(0,1);
			GMO.Globe.showNextPoint();
		},500);
	},

	buildGlobeData: function(){
		//console.log('   ');
		//console.log('@@@@@@@@@@@@@@@@@@ buildGlobeData');
		AppData.globeData = {};
		AppData.globeData.mapPoints = {};
		AppData.globeData.mapPoints.itemsToShow = [];
		AppData.globeData.mapPoints.itemsCounter = 0;
		AppData.globeData.mapPoints.lastId = 0;
		AppData.globeData.FullWidth = 3400;
		AppData.globeData.FullHeight = 900;
		
		AppData.globeData.degreesMaxLon = 360;
		AppData.globeData.degreesMaxLat = 180;
		
		AppData.globeData.globeWidthEach = AppData.globeData.FullWidth/2;
		AppData.globeData.globeHeightEach = AppData.globeData.FullHeight;
		
		AppData.globeData.zeroDegreesLon = AppData.globeData.globeWidthEach/2;
		AppData.globeData.zeroDegreesLat = AppData.globeData.globeHeightEach/2;
		
		AppData.globeData.pxPerDegreeLon = AppData.globeData.globeWidthEach/AppData.globeData.degreesMaxLon;
		AppData.globeData.pxPerDegreeLat = AppData.globeData.globeHeightEach/AppData.globeData.degreesMaxLat;
		
		//console.log('FullWidth: ' + AppData.globeData.FullWidth);
		//console.log('FullHeight: ' + AppData.globeData.FullHeight);
		//console.log('degreesMaxLon: ' + AppData.globeData.degreesMaxLon);
		//console.log('degreesMaxLat: ' + AppData.globeData.degreesMaxLat);
		//console.log('globeWidthEach: ' + AppData.globeData.globeWidthEach);
		//console.log('globeHeightEach: ' +AppData.globeData. globeHeightEach);
		//console.log('zeroDegreesLon: ' + AppData.globeData.zeroDegreesLon);
		//console.log('zeroDegreesLat: ' + AppData.globeData.zeroDegreesLat);
		//console.log('pxPerDegreeLon: ' + AppData.globeData.pxPerDegreeLon);
		//console.log('pxPerDegreeLat: ' + AppData.globeData.pxPerDegreeLat);
		
		GMO.Globe.setupGlobe();
	},
	

	buildGlobe: function(pointsHtml){
		var imageWidth = AppData.globeData.imageWidth;
		var imageHeight = AppData.globeData.imageHeight;
		$('#globe').spinningGlobe({
			imageWidth:imageWidth,
			imageHeight:imageHeight,
			earthWidth: 3400,
			earthHeight: 900,
			prefix: 'img/globe/',
			logo: false,
			resistance: 15,
			spin:1,
			testMode:0
		});
	},

	setupGlobe: function(){
		var fullWidth = AppData.globeData.FullWidth;
		var fullHeight = AppData.globeData.FullHeight;
		var maxWidth = AppData.App.config.globe.maxWidth;
		var maxHeight = AppData.App.config.globe.maxHeight;
		var $section = $('.section-globe');
		var $globe = $section.find('.globe');
		var windowWidth = $(window).width();
		windowWidthTotal = windowWidth;
		var paddingLeft = parseInt($section.css('paddingLeft').replace('px',''));
		var paddingRight = parseInt($section.css('paddingRight').replace('px',''));
		var paddingTotal = paddingLeft+paddingRight;
		var windowWidth = windowWidth - paddingTotal;
		if(maxWidth!=null && windowWidth>maxWidth){
			windowWidth = maxWidth;
		}
		if(maxHeight!=null && windowWidth>maxHeight){
			windowWidth = maxHeight;
		}
		
		var scale = windowWidth/fullHeight;
		AppData.globeData.scale = scale;
		AppData.globeData.map2OffsetLon = ( (AppData.globeData.FullWidth/2) * scale);
		AppData.globeData.map2OffsetLat = 0;
		AppData.globeData.width = fullWidth;
		AppData.globeData.height = fullHeight;
		var globeWidth = fullWidth;
		var globeHeight = fullHeight;
		var imageWidth = globeWidth*scale;
		var imageHeight = globeHeight*scale;
		AppData.globeData.imageWidth = imageWidth;
		AppData.globeData.imageHeight = imageHeight;
		//$globe.css('-webkit-transform','scale(' + scale + ',' + scale + ')');
		
		/*
		//console.log('windowWidthTotal',windowWidthTotal);
		//console.log('maxWidth',maxWidth);
		//console.log('paddingLeft',paddingLeft);
		//console.log('paddingRight',paddingRight);
		//console.log('paddingTotal',paddingTotal);
		//console.log('windowWidth',windowWidth);
		//console.log('#######################');
		//console.log('fullWidth',fullWidth);
		//console.log('fullHeight',fullHeight);
		//console.log('scale',scale);
		//console.log('imageWidth',imageWidth);
		//console.log('imageHeight',imageHeight);
		//console.log('globeWidth',globeWidth);
		//console.log('globeHeight',globeHeight);
		//console.log('=======================');
		*/
		GMO.Globe.buildGlobe();
	}
	
};

