// Namespacing
(function() {
    window.Apps = {
        Models: {},
        Collections: {},
        Views: {},
        //Routers: {}
    };

})();

// Models
// :Related model of posts
Apps.Models.Related  = Backbone.Tastypie.Model.extend({
urlRoot: 'api/related/',

initialize: function(){
	console.log("init")
},

});

// Collections
// :The collection of the related model of posts
Apps.Collections.RelatedCollection = Backbone.Tastypie.Collection.extend({
	model:Apps.Models.Related,
	urlRoot: 'api/related/'
});


// Views
// :The collection view of the related model of posts
Apps.Views.RelatedListView = Backbone.View.extend({

	tagName:'div',

	initialize:function () {
	    this.model.bind("reset", this.render, this);
	    _.bindAll(this, "render");
	    this.render();
	},

	render:function (eventName) {
	    _.each(this.model.models, function (Related) {
	        $(this.el).append(new Apps.Views.RelatedListItemView({model:Related}).render().el);
	    }, this);
	    return this;
	}

});

// view for individual related
Apps.Views.RelatedListItemView = Backbone.View.extend({
	tagName:"li",

	template : _.template($('#related_list_template').html()),

	initialize:function () {
	    note = this.model.get('note');
	},


	render:function (eventName) {
	    Related = new Apps.Models.Related();
	    $(this.el).html(this.template( this.model.toJSON() ));
	    return this;
	}

});

var app = new Apps.Routers.RelatedRouter();
