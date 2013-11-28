/**
 * Init the ajax requests
 */
jQuery( document ).ready( function() {

	// Show the report form when the button is clicked
	jQuery( ".send-report" ).fancybox({
		scrolling: 'no',
		autoDimensions: false,
		width: 320,
		height: 220
	});
	
	// Send the form and process the respond
	jQuery(".report-abuse-form").submit( function(){
		var emailCheck = /^[a-z0-9.-_\+]+@([a-z0-9-]+\.)+\w+$/;
		var email = jQuery( '#email', this );
		if ( email.length != 0 && email.val() !== '' && !emailCheck.test( email.val() ) ) {
			alert( report_abuse.wrong_email );
			return false;
		}
		
		var result_container = jQuery( this ).parents( ".report-abuse-form-container" );
		var entrydata = jQuery( this ).serialize() + '&abuse_action=add_report';
		result_container.html( report_abuse.loading );
		jQuery.post(
			report_abuse.ajaxurl + "?action=report_abuse",
			entrydata,
			function ( data ){
				result_container.html( data.message );
			},
			'json'
		);
		
		return false;
	} );
} );