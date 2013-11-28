var mobile_redirector,redirect_utils;
(
function( $ ) {
	mobile_redirector = {
		curUrl: window.location.href,
		fromDeviceQueryVar: 'brs',
		redirectTimeout: 5000,
		exMinutes: redirect_params.exp_days*60*24,
		remainingRequests:0,
		desktopURL: 'http://'+redirect_params.desktop_url+'/',
		mobileURL: 'http://'+redirect_params.mobile_url+'/',
		setcookieURLs: {
			'desktop': redirect_params.setcookie_desktop_url,
			'mobile': redirect_params.setcookie_mobile_url,
			'epi_desktop': redirect_params.setcookie_epi_url,
			'epi_mobile': redirect_params.setcookie_epi_mobile_url,
		},
		cookie_name: 'dn_blog_mobile',
		init: function() {
			if ( "true"== redirect_utils.getQueryVariable("nrdr") ) return;
			if ( !redirect_utils.areCookiesEnabled() )  return;
			if (  this.isMobilePage() ) {
				this.redirectFromMobile();
			} else {
				this.redirectFromDesktop();
			}
		},

		isMobilePage: function() {
			return this.curUrl.indexOf( this.mobileURL )!=-1;
		},

		
		deviceFromQuery: function () {
			return  redirect_utils.getQueryVariable( this.fromDeviceQueryVar );
		},

		redirectFromDesktop: function() {
			if(  redirect_utils.isMobileBrowser() && !redirect_utils.isTablet()  ){
				if( this.deviceFromQuery()=="m"){
					this.setPref( 'desktop' );
					return;
				} else {
					if('desktop'!= redirect_utils.getCookie(this.cookie_name)){
						this.redirectToMobile();
					}
				}
			}
		},
		setPref: function( env ) {
			 redirect_utils.setCookie( this.cookie_name, env, this.exMinutes );
		},
		showPopup: function() {
			var self = this;
			var link1 = $('<a>').attr('href', '#').click(function(){self.mobileSelected();return false;}).html('Till mobilversionen av DN.se');
			var link2 = $('<a>').attr('href', '#').click(function(){self.desktopSelected();return false;}).html('Till vanliga DN.se');
			this.popup = $('<div>').addClass("popup-container").attr('id',"popup-container").css("position"," fixed").css('z-index', 1001).hide();
			$('<div>').addClass('mobile-header').attr('id',"mobile-header").append(link1).append($('<span>').addClass('footer-link-text')).appendTo(this.popup);
			$('<div>').addClass('desktop-header').attr('id',"desktop-header").append(link2).append($('<span>').addClass('footer-link-text')).appendTo(this.popup);
			this.fade = $('<div>').attr('id', 'fade').css('filter', "alpha(opacity=80)").css('display', 'block').css('z-index',1000);
			$('body').prepend(this.fade);
			$('body').prepend(this.popup);
			this.popup.show();
		},
		hidePopup: function() {
			this.popup.hide();
			this.fade.hide();
		},

		redirectFromMobile: function() {
			var cookie_value= redirect_utils.getCookie(this.cookie_name);
			if( this.deviceFromQuery() == 'd' ){
				if( cookie_value==null || cookie_value==undefined){
					this.showPopup();
				} else{
					if(cookie_value=='desktop'){
						this.redirectToDesktop();
					}
				}
			}
		},

		redirectToMobile: function () {
			this.redirectTo(this.mobileURL, this.fromDeviceQueryVar, 'd');
		},

		redirectToDesktop: function () {
			this.redirectTo(this.desktopURL, this.fromDeviceQueryVar, 'm');
		},

		redirectTo: function ( url, var_name, var_value ) {
			var self = this;
			if (this.redirectTimeout>0 && this.remainingRequests != 0 ) {
				this.redirectTimeout-=2000;
				setTimeout(function(){ self.redirectTo( url, var_name, var_value );}, 2000);
				return;
			}
			var hostname = window.location.hostname;
			var f=this.curUrl.indexOf( hostname  )+hostname.length+1;
			var loc = url+this.curUrl.substring(f);
			if (var_name) {
				loc = redirect_utils.addVarToUrl(loc, var_name, var_value);
			}
			window.location.href=loc;
		},

		mobileSelected: function(){
			this.setPref( 'mobile' );
			this.setRemotePrefs('mobile');
			this.hidePopup();
		},
		setRemotePrefs: function( env ) {
			this.setRemotePref( this.setcookieURLs[ this.isMobilePage() ? 'desktop':'mobile' ], env );
			this.setRemotePref( this.setcookieURLs[ 'epi_desktop' ], env );
			this.setRemotePref( this.setcookieURLs[ 'epi_mobile' ],env );
		},

		desktopSelected: function(){
			this.setPref( 'desktop' );
			this.setRemotePrefs('desktop');
			this.redirectToDesktop();
		},

		setRemotePref: function( url, env ) {
			self = this;
			this.remainingRequests++;
			url = redirect_utils.addVarToUrl( url, 'preference', env);
			$.getScript( url, function(data, textStatus, jqxhr ) {
				self.remainingRequests--;
			});
		}
	};

	redirect_utils = {
		setCookie: function( name,value,exp ){
			var date=new Date;
			date.setMinutes(date.getUTCMinutes()+exp);
			var i=escape(value)+"; expires="+date.toUTCString()+"; path=/";
			document.cookie=name+"="+i
		},

		getCookie: function ( name ){
			var t,n,r,i=document.cookie.split(";");
			for(t=0;t<i.length;t++){
				n=i[t].substr(0,i[t].indexOf("="));r=i[t].substr(i[t].indexOf("=")+1);n=n.replace(/^\s+|\s+$/g,"");if(n==name){return unescape(r)}
			}
		},
		isMobileBrowser : function() {
			return navigator.userAgent.match(/(IEMobile|Windows CE|iP(od|hone)|NetFront|PlayStation|MIDP|UP\.Browser|Symbian|Nintendo|Android|iPhone)/i)
		},

		isTablet:function(){
			e=navigator.userAgent.toLowerCase();
			if(e.indexOf("ipad")>-1||e.indexOf("android")>-1&&e.indexOf("mobile")<0){return true}
			return false;
		},

		getQueryVariable : function ( name ){
			var t=window.location.search.substring(1);
			var n=t.split("&");
			for(var r=0;r<n.length;r++){
				var i=n[r].split("=");
				if(i[0]==name){return i[1]}
			}
			return '';
		},

		areCookiesEnabled: function(){
			if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled){ 
				document.cookie="testcookie";
				return( document.cookie.indexOf("testcookie") != -1 );
			} 
			return navigator.cookieEnabled;
		},

		addVarToUrl: function(loc, var_name, var_value ) {
			var r1 = new RegExp(var_name+'=[^&]+&', 'g');
			var r2 = new RegExp('[&?]'+var_name+'[^&]+');
			loc = loc.replace(r1, '').replace(r2, '');
			loc += loc.indexOf("?")!=-1? '&':'?';
			loc += var_name+'='+var_value;
			return loc;
		}


	};
//	$(document).ready(function(){ mobile_redirector.init(); });
}
)(jQuery)
