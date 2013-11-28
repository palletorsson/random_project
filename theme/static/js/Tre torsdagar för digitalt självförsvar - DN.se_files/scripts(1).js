


function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

// dnse substitute functions
$ = jQuery;
jQuery(function() {
	/*
	 * MARK CORRECT ACTIVE SUBMENU
	 */
	if(typeof dnblogg_blogurl !== 'undefined') {
		 var correct_submenu = jQuery('#submenu li a[href="' + dnblogg_blogurl + '"]');
		 if (correct_submenu) {
		  var allsubmenus = jQuery('#submenu li');
		  allsubmenus.removeClass('active');
		  correct_submenu.parent().addClass('active');
		 }
	}
	/*
	 * Metadata - jQuery plugin for parsing metadata from elements
	 *
	 * Copyright (c) 2006 John Resig, Yehuda Katz, J�örn Zaefferer, Paul McLanahan
	 *
	 * Dual licensed under the MIT and GPL licenses:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *   http://www.gnu.org/licenses/gpl.html
	 *
	 * Revision: $Id: jquery.metadata.js 3640 2007-10-11 18:34:38Z pmclanahan $
	 *
	 */
	(function(jQuery){jQuery.extend({metadata:{defaults:{type:"class",name:"metadata",cre:/({.*})/,single:"metadata"},setType:function(type,name){this.defaults.type=type;this.defaults.name=name},get:function(elem,opts){var settings=jQuery.extend({},this.defaults,opts);if(!settings.single.length){settings.single="metadata"
	}var data=jQuery.data(elem,settings.single);if(data){return data}data="{}";var getData=function(data){if(typeof data!="string"){return data}if(data.indexOf("{")<0){data=eval("("+data+")")}};var getObject=function(data){if(typeof data!="string"){return data}data=eval("("+data+")");return data};if(settings.type=="html5"){var object={};
	jQuery(elem.attributes).each(function(){var name=this.nodeName;if(name.match(/^data-/)){name=name.replace(/^data-/,"")}else{return true}object[name]=getObject(this.nodeValue)})}else{if(settings.type=="class"){var m=settings.cre.exec(elem.className);if(m){data=m[1]}}else{if(settings.type=="elem"){if(!elem.getElementsByTagName){return
	}var e=elem.getElementsByTagName(settings.name);if(e.length){data=jQuery.trim(e[0].innerHTML)}}else{if(elem.getAttribute!=undefined){var attr=elem.getAttribute(settings.name);if(attr){data=attr}}}}object=getObject(data.indexOf("{")<0?"{"+data+"}":data)}jQuery.data(elem,settings.single,object);return object}}});
	jQuery.fn.metadata=function(opts){return jQuery.metadata.get(this[0],opts)}})(jQuery);
	
	
	/*
	 * MANAGE TABS IN MOST COMMENTED BOX
	 */ 
  jQuery.fn.dnseInlineTabs = function(options) {
    var $this = jQuery(this);
    var $parent = $this.parent().parent().parent();
    $pO = jQuery.extend(options,jQuery(this).metadata());
    $parent.find("ul.inline-tabs a").removeClass("active");
    $this.addClass("active");
    $parent.find(".inline-tabs-contents").hide();
    $parent.find("."+$pO.tab).show();
  };
  jQuery("div#hook .inline-tabs li a").click(function(e) {
  	e.preventDefault();
    jQuery(this).dnseInlineTabs();
    return false;
  });
	
  /*
   * VERY POOR LIGHTBOX SUBSTITUDE TO SHOW COMMENTING TERMS OF SERVICE
   */ 
  jQuery("a[rel=dnsemodalwindow]").click(function(e) {
  	jQuery('#dnblogg-hidden-slaskdiv').html('').load(jQuery(this).attr('href'), null, function() {
  		alert( jQuery('#dnblogg-hidden-slaskdiv').text() );
  	});
  	e.preventDefault();
  	return false;
  }); 
  
  /*
   * COMMENT BOX SHOULD NOT BE CLICKABLE WHEN EXPANDED
   */
  jQuery('#article-comments.expand a').click(function(e) {
  	e.preventDefault();
  	return false;
  });
});
