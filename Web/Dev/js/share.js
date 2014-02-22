GMO.Share = {
	init: function(){
		GMO.Share.addLinks();
	},	

	addLinks:function(provider){
		var shareData = AppData.App.config.share;
		var shareUrl = shareData.shareUrl;
		shareUrl = 'http://www.gmolive.com/share/index.html';
		var urlFb = 'http://www.facebook.com/sharer.php?u=' + shareUrl;
		$('li.share-facebook a').attr('href',urlFb);

		var shareText = shareData.twitter.body1;
		var urlTwitter = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl;
		$('li.share-twitter a').attr('href',urlTwitter);
	
		var textData = shareData.email;
		var subjectText = textData.subject;
		var bodyText = textData.body;
		var userId = 'fxgd4sdf';
		var urlEmail = $('li.share-email a').attr('href') + '?shareId=' + userId;
		$('li.share-email a').attr('href',urlEmail);

		$('.footer-primary a').attr('href',AppData.App.config.logo.url);
	},

	handleShare:function(provider){
		var shareData = AppData.App.config.share;
		var shareUrl = shareData.shareUrl;
		if(provider=='facebook'){
			var url = 'http://m.facebook.com/sharer.php?u=' + shareUrl;
			window.open(url, '_blank', 'location=yes');
		}
		else if(provider=='twitter'){
			var shareText = shareData.twitter.body1;
			var url = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl;
			window.open(url, '_blank', 'location=yes');
		}
		else if(provider=='email'){
			var textData = shareData.email;
			var subjectText = textData.subject;
			var bodyText = textData.body;
			var url = 'mailto:?subject=' + subjectText + '&body=' + bodyText + ' ' + shareUrl;
			window.location.href = url;
		}
	}
	
};
