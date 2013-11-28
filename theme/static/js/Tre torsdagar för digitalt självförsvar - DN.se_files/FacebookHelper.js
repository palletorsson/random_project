if (document.fbHelper == null) {
    document.fbHelper = {
        facebookInitCompleted: false,
        facebookNewApiPath: facebookNewApiPath,
        facebookAppId: facebookAppId,
        facebookChannelUrl: facebookChannelUrl,
        userDomain: document.domain,
        isLoggedIn: false,
        userId: null,
        facebookUserName: null,
        listeners: [],

        addLoggedInListener: function(self, listener) {
            this.listeners.push({ owner: self, func: listener });
        },

        fireLoggedInEvents: function() {
            for (i = 0; i < this.listeners.length; i++)
                this.listeners[i].func(this.listeners[i].owner, this)
        },

        onFacebookLoggedIn: function(isLoggedInF) {
            var o = this;
            window.setTimeout(function() { o.handleFacebookLoggedIn(isLoggedInF); }, 0);

        },

        setControlsState: function() {
            var o = this;
            if (o.isLoggedIn) {
                jQuery('.fbc-authentication .fbc-login-name').html(o.facebookUserName);
                jQuery(".fbc-authentication a.fbc-login-name").attr("href", "http://www.facebook.com/profile.php?id=" + o.userId);
                jQuery('.fbc-authentication .status.noauth').css('display', 'none');
                jQuery('.fbc-authentication .status.auth').css('display', 'block');
                FB.api('/me', { fields: "id, name, picture" }, function(response) {
                    o.setUserProfilePicture(response);
                });
            } else {
                jQuery('.fbc-authentication .fbc-login-name').html('');
                jQuery(".fbc-authentication a.fbc-login-name").attr("href", "");
                jQuery('.fbc-authentication .status.noauth').css('display', 'block');
                jQuery('.fbc-authentication .status.auth').css('display', 'none');
                jQuery('.fbc-authentication .fbc-profile-image').html('');
            }
            jQuery('.fbc-authentication.auto').css('display', 'block');
        },

        handleFacebookLoggedIn: function(isLoggedInF) {
            var o = this;
            o.userId = null;
            o.facebookUserName = null;
            o.isLoggedIn = false;

            var authResponse = FB.getAuthResponse();
            var userId = null;
            if (authResponse != null) userId = authResponse.userID;

            if (isLoggedInF && userId != null) {
                FB.Data.query("select uid, name from user where uid='{0}'", userId).wait(
                    function(users) {
                        if (users != null && users.length > 0) {
                            o.userId = userId;
                            o.facebookUserName = users[0].name;
                            o.isLoggedIn = true;
                            o.setControlsState();
                            o.fireLoggedInEvents();
                        }
                    });
            }
            else {
                o.setControlsState();
                o.fireLoggedInEvents();
            }
        },
        setUserProfilePicture: function(user) {
            jQuery(".fbc-authentication .fbc-profile-image").html(
                '<a href="http://www.facebook.com/profile.php?id='
                + user.id + '" class="external-url"><img src="'
                + (user.picture == null
                    ? 'http://static.ak.connect.facebook.com/pics/q_silhouette_logo.gif'
                    : user.picture) + '" class="user-profilepicture" /></a>');
        },
        helpDialog: function(url, caption) {
            jQuery.get(url, function(data) {
                if (data == null) return;
                jQuery.nyroModalManual({ title: caption, content: data });
            });
            return;
        },
        initFacebook: function() {
            if (typeof (FB) === 'undefined' || FB == null) return;
            if (this.facebookInitCompleted) return;
            this.facebookInitCompleted = true;

            jQuery('.fbc-authentication.auto').css('display', 'none');

            jQuery('.fbc-authentication .fbc-login').live('click', function() { FB.login(function(a) { }, { scope: 'read_stream, publish_stream' }); return false; });
            jQuery('.fbc-authentication .fbc-logout').live('click', function() { FB.logout(); return false; });

            var helpItem = jQuery('.fbc-authentication a.fbc-help-dialog');
            helpItem.click(function() { document.fbHelper.helpDialog(jQuery(this).attr("href"), jQuery(this).attr("title")); return false; });

            FB.init({ appId: document.fbHelper.facebookAppId, status: true, cookie: true, xfbml: true, channelUrl: document.fbHelper.facebookChannelUrl });

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    document.fbHelper.onFacebookLoggedIn(true);
                }
                else {
                    document.fbHelper.onFacebookLoggedIn(false);
                }
                FB.Event.subscribe('auth.login', function() { document.fbHelper.onFacebookLoggedIn(true); });
                FB.Event.subscribe('auth.logout', function() { document.fbHelper.onFacebookLoggedIn(false); });
            });

            jQuery('.fbLike').each(function() { FB.XFBML.parse(this); });
        }
    };
}

window.fbAsyncInit = function() {
jQuery(document).ready(function() {
    document.fbHelper.initFacebook();
});
};

var LoadFacebookApiLibrary =
function() {
    var e = document.createElement('script');
    e.src = document.fbHelper.facebookNewApiPath;
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
};

