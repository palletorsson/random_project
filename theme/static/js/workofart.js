
(function() {
var WORKOFART = WORKOFART || {};



WORKOFART.Related = function (value) {

	related = WORKOFART.related;
	me = this; 

	var element = $('#'+value.anchor);

	var position = element.position();
	var top = position.top || value.top;
	 
	
	if (value.type == 2) {
		var template = 		'<div class="related arrow" style="position:absolute;top:'+(top-60)+'px;" >' +
							'<p><span class="glyphicon glyphicon-link"></span>  <a href="{{link}}">{{note}}</a> </p>' +  
							'</div>';
	}

	if (value.type == 4) {
		var template = 		'<div class="related arrow" style="position:absolute;top:'+(top-60)+'px;" >' +
							'<p> <img src="/media/{{image.image}}" style="width:100%;"/> </p> ' +  
							'<hr /> ' +  
							'<p> {{note}} </p>' +  
							'</div>';
	}
	
	if (value.type == 'C') {
		
		var images_html = ''
		var l = value.images.length; 

   		$.each(value.images, function( index, value ) {
			if (index == 0) {
				images_html = images_html + '<div class="item active"><img src="/media/'+value+'" /></a></div>' 
			}
			else {
				images_html = images_html + '<div class="item"><img src="/media/'+value+'" /></a></div>' 
			}

			if (index == l-1) {
       			var template = 	'<a href="/images/hacknight_images"><div class="related arrow" style="position:absolute;top:'+(top-60)+'px;" >' +
								'<div id="carousel-id" class="carousel slide">'+
    							'<div class="carousel-inner">'+
									images_html +
									'</div>'+
    							'</div>'+
    							'<!-- Controls -->'+
    							'<a class="left carousel-control" href="#carousel-id" data-slide="prev">'+
    							'<span class="icon-prev"></span>'+
    							'</a>'+
    							'<a class="right carousel-control" href="#carousel-id" data-slide="next">'+
    							'<span class="icon-next"></span>'+
    							'</a>'+
    							'</div></div></a>';

				var html = Mustache.render(template, value);
				$('.related_outer').append(html);
			}
    	});



	}
	

	var html = Mustache.render(template, value);
	$('.related_outer').append(html);


}



var postId = $('#post_id').text();

if (postId) {
	$.get("http://127.0.0.1:8000/api/related/?format=json&post="+postId, function( data ) {

		$.each(data.objects, function() {
			new WORKOFART.Related(this);
		});
	});
}


})();






