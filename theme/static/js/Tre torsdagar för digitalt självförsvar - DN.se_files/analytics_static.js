function send_panel() {
var OAS_server = 'http://sifomedia.dn.se';
if (!(OAS_rn)) {
var OAS_rn = new String(Math.random());
var OAS_rns = OAS_rn.substring(2, 11);
}
var OAS_taxonomy='&Sajt=dn.se&Sektion='; //Add Taxonomy here. Begin with '&'
try {OAS_taxonomy+=TNS_section;}
catch (e) {OAS_taxonomy+='undefined';}
document.write('<iframe src="http://panel2.research-int.se/0/RI-Panel/pixel/set_panel2.html?' + OAS_rns + '__!__' + OAS_server + '__!__' + OAS_taxonomy + '" style="display:none;"></iframe>');
return true;
}
if (document.cookie.indexOf('member_type=') === -1) send_panel();

var cX = cX || {}; cX.callQueue = cX.callQueue || [];
cX.callQueue.push(['setAccountId', '9222280920508046879']);
cX.callQueue.push(['setSiteId', '9222280920508046887']);
cX.callQueue.push(['sendPageViewEvent']);

(function() { 
	try { var scriptEl = document.createElement('script'); scriptEl.type = 'text/javascript'; scriptEl.async = 'async';
	scriptEl.src = ('https:' == document.location.protocol) ? 'https://scdn.cxense.com/cx.js' : 'http://cdn.cxense.com/cx.js';
	var targetEl = document.getElementsByTagName('script')[0]; targetEl.parentNode.insertBefore(scriptEl, targetEl); 
	} 
	catch (e) {};
} ());