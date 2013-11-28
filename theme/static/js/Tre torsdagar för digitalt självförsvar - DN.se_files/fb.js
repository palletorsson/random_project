// www.dn.se:
// FB.init("e7a3d1414b3fab80e5ff88e0179c339e", "/static/dn/fbc/xd_receiver.html", {"ifUserConnected":fbConnectHandler, "ifUserNotConnected":fbConnectHandler});
// local test: eae497a1016c4f6560992de83dd1af99 (??)
// dnse.localhost.dn.se (bör också fungera på *.dn.se)
if(dnblogg_facebook_appid) {
	var dnblogg_FB = FB;
	//window.fbAsyncInit = function() {
		FB.init({
		  appId  : dnblogg_facebook_appid,
		  status : true, // check login status
		  cookie : true, // enable cookies to allow the server to access the session
		  xfbml  : true  // parse XFBML
		});
	//}
}

var resolve_facebook_commenters = function() {
	var ids = new Array();
	jQuery('.facebook-name').each(function(a,b) {
		var fbid = jQuery('span:first', b).text(); //.substr(2);
		ids.push(fbid);
	});
	// query for names
	jQuery.getJSON(
		"http://graph.facebook.com/" +
		"?ids=" + ids.join(",") +
		"&fields=name" + 
		"&callback=?",
		null,
		function(data) {
			jQuery.each(data, function(i,o) {
				jQuery( '.fb'+o.id ).html( o.name );
			});
		}
	);
	
};
jQuery( resolve_facebook_commenters );

var dnblogg_facebook_loggedin = false;
function dnblogg_facebook_state(state) {
	if(state.session) {
	  FB.api("/me", function(user) {
	  	dnblogg_facebook_loggedin = true;
		  jQuery('.row-email').hide().children('input').val(user.id + "@facebook.com");
		  jQuery('.row-username .name-row').hide();
		  jQuery('.row-username input.author').val( "Facebookanvändare" );
		  jQuery('.row-username .fbc-authentication .noauth').hide();
		  jQuery('.row-username .fbc-authentication .auth').show();
		  jQuery('.row-username .fbc-authentication .auth .user-profilepicture').html('<img src="http://graph.facebook.com/'+user.id+'/picture" alt="" />' );
		  jQuery('.row-username .fbc-authentication .auth .user-name, #fbc-recommend .user-name').text( user.name );
		  //alert(dump(user));
		  // recommendations
		  jQuery('#fbc-recommend .noauth').hide();
		  jQuery('#fbc-recommend .auth').show();
		  jQuery('#fbc-recommend .share-on-fb').attr('checked', true);
	  });
 	} else {
 		//alert('tried to log out');
 		dnblogg_facebook_loggedin = false;
	  jQuery('.row-email').show().children('input').val("");
	  jQuery('.row-username .name-row').show();
	  jQuery('.row-username input.author').val("");
	  jQuery('.row-username .fbc-authentication .noauth').show();
	  jQuery('.row-username .fbc-authentication .auth').hide();
	  // recommendations
	  jQuery('#fbc-recommend .noauth').show();
	  jQuery('#fbc-recommend .auth').hide();
	  jQuery('#fbc-recommend .share-on-fb').attr('checked', false);
 	}
}
FB.getLoginStatus(dnblogg_facebook_state, true);

  
jQuery(function(){
	// remove original (DN.se) bindings form the fb login/logout link, and use our own function
	jQuery('.fbc-login').unbind().click(function(event) {
		FB.login(dnblogg_facebook_state);
		event.preventDefault(1);
		return false;
	});
	jQuery('.fbc-logout').unbind().click(function(event) {
		FB.logout(dnblogg_facebook_state);
		event.preventDefault(1);
		return false;
	});

	var fbpub = function(prompt, comment) {
		if(dnblogg_FB)
			FB = dnblogg_FB;

		// fb dialog appears at top of page for safari
		if(jQuery.browser.safari)
			window.scrollTo(0,0);
		// show fb dialog
		FB.ui(
    	{
			  method: 'stream.publish',
			  message: comment,
			  attachment: {
			    name: document.title,
			    caption: dnblogg_post_excerpt,
			    //description: ( "Min kommentar: " + comment.val() ),
			    href: dnblogg_post_permalink,
			    media: [
			      {
			        type: 'image',
			        href: dnblogg_post_permalink,
			        src: dnblogg_post_image
			      }
			    ]
			  },
			  action_links: [
			    //{ text: 'fbrell', href: 'http://fbrell.com/' },
			    //{ text: 'Läs inlägget och fler kommentarer här', href: dnblogg_post_permalink }
			  ],
			  user_message_prompt: prompt // was user_prompt_message
    	},
	    function(response) {
		    if(response) {
		    }
		    else {
		    }
    	}
    );
	};
	
	
	/**
	 * Handle submission of comment form using AJAX, and show publish to FB dialog on successfull submission
	 */
	// Bind the submit button to just submitting the form, and unbind all other (DN.se) events
	jQuery('#comments a.submitbutton').unbind().click(function(event) {
		jQuery('#commentform').submit();
		event.preventDefault(); return false;
	});
	// handle submission of the form, and unbind all other (DN.se) events
	jQuery('#commentform').unbind().submit(function(event) {
		var comment = jQuery('#comment');
		// build data array
		var data = {
				ajax: true,
				redirect_to: document.location.href
		};
		// collect all form data and put in the data array
		jQuery('#commentform input,#commentform textarea').each(function(index, elem) {
			if(jQuery(elem).attr('type') == 'checkbox')
				// checkbox fields needs to be handled differently
				data[jQuery(elem).attr('name')] = jQuery(elem).is(':checked') ? '1' : '0';
			else
				// just add the value of all other fields
				data[jQuery(elem).attr('name')] = jQuery(elem).val();
		});
		  
	  // submit with ajax
	  jQuery.ajax({
	  	type: 'POST',
	  	url: jQuery('#commentform').attr('action'),
	  	data: data,	  	
	  	dataType: 'html',
	  	// ON SUCCESS FUNC
	  	success: function(data, status) {
				// update comment list
				var new_list = jQuery('#the-actual-list-of-comments', jQuery(data));
				jQuery('#the-actual-list-of-comments').empty().append( new_list );
				resolve_facebook_commenters();
				// clear old comment
				var comment_text = comment.val(); 
				comment.val("");
				
	  		// show FB publish
	  		if(dnblogg_facebook_loggedin && jQuery('#comment-publish-facebook').is(':checked')) {
	  			fbpub('Din kommentar', comment_text);
	  		} // endif, publish to facebook
		  },
		  // ON ERROR FUNC
	  	error: function(req, status, error) {
			//console.log('req',req);
		  	var msg = jQuery('<div>'+req.responseText+'</div>').text();
	  		alert(msg);
	  	}
	  });
	  // prevent normal form submission
	  event.preventDefault(); return false;
	});
	
	/**
	 * handle recommendations 
	 */
	jQuery('#fbc-recommend a.recommend-link').unbind().click(function(e) {
	  jQuery.ajax({
	  	type: 'POST',
	  	url: dnblogg_ajaxurl,
	  	// PARAMS
	  	data: {
	  		action: 'dnblogg_recommendations_recommend',
	  		post_id: dnblogg_post_id
	  	},
	  	// ON SUCCESS FUNC
	  	success: function(data, status) {
	  		// pub to fb?
	  		if(dnblogg_facebook_loggedin && jQuery('#fbc-recommend .share-on-fb').is(':checked')) {
	  			fbpub('Kommentera din rekommendation', 'Jag rekommenderar det här inlägget på DN.se');
	  		}
	  		// show result message
	  		jQuery('#fbc-recommend .recommend-holder').html('<p class="recommended">Du och '+ (data-1) +' andra har rekommenderat den här artikeln</p>');
	  	}
	  });
	  // done
	  e.preventDefault();
	  return false;
	});
});     
