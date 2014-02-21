GMO.Share = {
	init: function(){
		GMO.Share.setupHandlers();
	},	

	setupHandlers:function(){
		$('ul.list-share li').on('click',function(){
			GMO.Share.handleShare($(this).data('id'));
			return false;
		});
		$('.footer-primary i.logo').on('click',function(){
			var url = AppData.App.config.logo.url;
			window.open(url, '_blank', 'location=yes');
			return false;
		});
		
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
