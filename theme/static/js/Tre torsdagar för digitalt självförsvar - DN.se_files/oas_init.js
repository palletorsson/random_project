var advertisementCookieName = "dn_panel";
if (getCookie(advertisementCookieName)) {
    OAS_query += '&' + advertisementCookieName + '=' + getCookie(advertisementCookieName);
}

if (typeof(window.byburt_segments)!="undefined") OAS_query+="&segments=,"+window.byburt_segments.toString()+","
OAS_query += "&XE&" +OAS_query+ "&XE"; //Analytics

var OAS_rns = (Math.random() + "").substring(2, 11);
document.write('<scr' + 'ipt type="text/javascript" src="' + OAS_url + '/adstream_mjx.ads/' + OAS_sitepage + '/1' + OAS_rns + '@' + OAS_listpos + '?' + OAS_query + '"><\/script>');

try {(OAS_sitepage==="dn.se/nyheter/ettan") ? TNS_section='Ettan' : TNS_section=OAS_sitepage.split('/')[1]} 
catch (e) {TNS_section='undefined'}