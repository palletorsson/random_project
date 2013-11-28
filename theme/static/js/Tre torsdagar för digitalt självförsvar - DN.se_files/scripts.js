// The print button listener
jQuery(document).ready(function() {
    jQuery(".print").click( function() {
    	printElem( jQuery( "#" + jQuery(this).attr( 'elem-id' ) ) );
        return false;
    } );

	jQuery(".socialtabs .tabs.active").tabs(".panes > div", {
		effect: 'slide'
	});

	if( window.location.hash == '#comments' || window.location.hash == '#respond' ){
		//var tabs_api = jQuery(".socialtabs .tabs.active").data("tabs");
		setTimeout(function(){
			//tabs_api.click(1);
			jQuery(".socialtabs .tab_comments a").click();
		}, 100);
	}
});

function printElem( elem ){
	elem.printElement({printMode: 'popup', leaveOpen: true});
}