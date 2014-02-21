GMO.Contact = {
	init: function(){
		GMO.Contact.setupLinks();
	},	

	setupLinks:function(){
		console.log('setupLinks');
		var $list = $('.list-buttons');
		var $call = $list.find('.button-call a');
		var $email = $list.find('.button-email a');
		
		var data = AppData.App.config.contact;
		
		var callHref = 'tel:' + data.phone;
		var subjectText = data.email.subject;
		var bodyText = data.email.body;
		var emailHref = 'mailto:' + data.email.address + '?subject=' + subjectText + '&body=' + bodyText;
		
		console.log('callHref: ' + callHref);
		
		$call.attr('href',callHref);
		$email.attr('href',emailHref);
	}
	
};

