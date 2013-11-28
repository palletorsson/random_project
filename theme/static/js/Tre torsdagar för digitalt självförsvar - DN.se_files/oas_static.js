function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (OAS_sitepage==="dn.se") {
	OAS_init=window.location.hostname.split('.')[0];
	(OAS_init != 'www' && OAS_init != 'dn') ? OAS_sitepage="dn.se/"+OAS_init : OAS_sitepage="dn.se/nyheter/ettan";
}

if ( OAS_sitepage==="dn.se/nyheter/ettan" && document.cookie.indexOf(li_key)==-1) {
	var advertisementCookieName = "dn_panel";
	if (getCookie(advertisementCookieName)) RED_query = '?' + advertisementCookieName + '=' + getCookie(advertisementCookieName);
	else RED_query="";
	document.write('<scr' + 'ipt type="text/javascript" src="http://oas.dn.se/2/dn.se/nyheter/ettan/1' + (Math.floor(Math.random()* 100000000)) +'@Redirect' + RED_query + '"><\/script>');
}

var a = OAS_sitepage.split("/");
if (a.length == 2 || (a.length == 3 && a[a.length - 1] == "")) {
	// section and if nothing to the right of last slash
	OAS_sitepage += "/hem";
}

function initAdvert(a) {
    if (a != undefined && a != "") {
        var c = document.getElementById(a);
        if (!c) {
            return;
        }
        var d = c.getElementsByTagName("a");
        var e = true;
        for (var b = 0; b < d.length; b++) { e = false; var img = d[b].getElementsByTagName("img").item(0); if (img) e = img.src.indexOf("default/empty.gif") == -1; }
        if (e) {
            c.style.display = "block";
			showAllParents(c);
        }else{
            c.style.display='none';
        }
    }
}
function resizeIFrame(elem,t) {
	if(typeof t=='undefined')
	   t=10; 
	var temp=   function(){   
		  //try {
			showAllParents(elem);
			var body = elem.contentDocument ? elem.contentDocument.body : elem.document.body;
			var listATags = body.getElementsByTagName("a");
			var notExistEmptyImage = true;
			for (var i = 0; i < listATags.length; i++) {
				notExistEmptyImage = listATags[i].href.indexOf("default/empty.gif") == -1;
			}
			if (notExistEmptyImage) {
				var height = getIframeHeight(elem);
				elem.style.height = height + 'px';
				elem.parentNode.style.height = height + 'px';            
			}
			else {
				var parent = elem.parentNode;
				parent.parentNode.style.display = 'none';
				var closest = closestNode('box-advert', elem);
				var closestAdvSpace = closestNode('advert-space', elem);
			   if(closestAdvSpace){
				  closestAdvSpace.style.display = 'none';
			   }
			};
			//}
			//catch (er) { }
		};    
	if(t==0){
	 temp();
	}else{
	 setTimeout(temp,t);
	}
}
function getIframeHeight(iframe){
    if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
           return iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
    }
    return 0;
}
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
// show all parents of current node
function showAllParents(currentNode) {
    while (true) {
        var parent = currentNode.parentNode;
        if (!parent || hasClass('box-advert', parent) || parent.tagName == 'body' || parent == document || parent == window) {
            if (hasClass('box-advert', parent))
                parent.className+=' displayAd'
            return;
        } else {
            parent.className+=' displayAd'
        }
        currentNode = parent;
    }
}

// get height of element
function getDocHeight(ele) {
    return Math.max(
        ele.scrollHeight,
        ele.offsetHeight,
        ele.clientHeight
    );
}

// find closest node with current node that has class as given
function closestNode(className, currentNode) {
    while (true) {
        var parent = currentNode.parentNode;
        if (!parent || parent.tagName == 'body') {
            return null;
        }
        if (hasClass(className, parent)) {
            return parent;
        }
        currentNode = parent;
   }
}

// check if node has className as given or not
function hasClass(className, node) {
    var tmp = (node.className || '').split(' ');
    return tmp.indexOf(className) > -1;

}

loadFrame = resizeIFrame;
var createIframe = function (d, wrapperId, position, frameId) {
    var iframe = d.createElement('iframe');
    iframe.frameBorder = 0;
    d.getElementById(wrapperId).appendChild(iframe);
    var doc = iframe.contentWindow.document;
    iframe.setAttribute("frameBorder", "0");
    iframe.pos = position;
    iframe.name = position;
    iframe.className = "iframe_" + position;
    iframe.width = "100%";
    iframe.id = frameId;
    iframe.setAttribute('onload', 'resizeIFrame(this)');
    // style the iframe with some CSS

    iframe.style.cssText = "overflow:hidden;border:0;";
    doc.open().write('<body onload="' +
					'parent.document.getElementById(\'' + frameId + '\').src=\'/Oas/OASContainer.htm\';' +
					'">');
    doc.close(); //iframe onload event happens
};

var write = document.write;
function loadAd(target) {
    if (typeof OAS_RICH == 'undefined' || !OAS_RICH) {
        //if (queueAds&&queueAds.indexOf(target) == -1) {
        //    queueAds.push(target);
        //}
        return;
    }
    var pos;
    var attributes;
    if (target.frameElement && target.frameElement.attributes) {
        attributes = target.frameElement.attributes;
    } else if (target.attributes) {
        attributes = target.attributes;
    }

    if (attributes && attributes["data-position"]) {
        pos = attributes["data-position"].value;
    }

    if (!pos) {
        return;
    }

    //    pos = target.frameElement.pos;
    var d = target.document || target.contentDocument;
    var adtag = '';
    document.write = function (s) { adtag += s; };
    OAS_RICH(pos);
    document.write = write;

    if (window.burt_api && window.burt_api.site && window.burt_api.site.trackAd) {
        adtag = window.burt_api.site.trackAd(pos, d, adtag);
    }

    // Write the adtag in the iframe
    d.write(adtag);
}

var alreadyAddedPositions = [];
// MAKE AD-FUNCTIONCALL AND SHOW-HIDE ADSLOT FUNCTIONALITY - THIS MIGHT NEED SOME WORK

function bskAd(position, elementId, useIframe, document, wrapperId, frameId, frameHeight) {
    var isAlreadyAddedPosition = false;
    for (var i = 0; i < alreadyAddedPositions.length; i++) {
        if (alreadyAddedPositions[i] == position) {
            isAlreadyAddedPosition = true;
            break;
        }
    }
    if (!isAlreadyAddedPosition) {
        alreadyAddedPositions.push(position);
        OAS_AD(position, useIframe, document, wrapperId, frameId);
        if (elementId && !useIframe) {
            initAdvert(elementId);
        }
    }
}

// MAKE AD-FUNCTIONCALL TO MJX AD CALL, OR TO PRODUCE NX AD CALLS (BELOW) DEPENDING ON USERS BROWSER

function OAS_AD(pos, useIframe, document, wrapperId, frameId) {
    if (!useIframe) {
        if (window.burt_api && window.burt_api.site && window.burt_api.site.trackOasAd) {
            window.burt_api.site.trackOasAd(pos, function () {
                OAS_RICH(pos);
            });

        } else {
            OAS_RICH(pos);
        }
    }
    else {
        createIframe(document, wrapperId, pos, frameId);
    }
}

function getZoomFactor() { var factor = 1; if (document.body.getBoundingClientRect) { var rect = document.body.getBoundingClientRect(); factor = Math.round(((rect.right - rect.left) / document.body.offsetWidth) * 100) / 100; } return factor; }
function doScroll(target) {if ('pageXOffset' in window) {var scrollLeft = window.pageXOffset;} else {var zoomFactor = getZoomFactor();var scrollLeft = Math.round(document.documentElement.scrollLeft / zoomFactor);}var el= document.getElementById(target);if(el){el.style.marginLeft = '-' + (scrollLeft) + 'px';}}