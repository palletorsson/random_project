


$( document ).ready(function() {
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
var api = false;

if (api) {
	$.get("http://127.0.0.1:8000/api/related/?format=json&post="+postId, function( data ) {

		$.each(data.objects, function() {
			new WORKOFART.Related(this);
		});
	});
}

var mainline = false;

$('.mainline_button').click(function() {
    if (mainline) {
        $('.section_body').css({color:'#000'});
        $('.section_line, .section_note').css({display:'none'});

        mainline = false
    }
    else {
        mainline = true
        $('.section_body').css({color:'pink'});
        $('.section_line, .section_note').css({display:'block'});
    }

});


 $('.section_body').each( function() {
         h = $(this).height();
         h = h/2+100;
         $(this ).children('.section_line').css({top:'-'+h+'px', color: 'black'});
         h = h-20;
         $(this ).children('.section_note').css({top:'-'+h+'px', color: 'black'});
    });

$('.related').css({display:'block'});

var top_position = 0;
var index_footnote = 0;

related =  $('.related_section_target');

related.each(function() {
     target_id = this.id;
     type = $(this).attr('data-target');
     console.log(type)

     if (type != 9) {
        target = $('.section_'+target_id +' .section_body');
        top_position = parseInt(target.offset().top);
        $(this).css({position:'absolute', top:top_position, left:'66%'});
     } else {

         index_footnote++;
         html = $(this).html()
         target = $('.section_'+target_id +' .section_body');
         search_text = target.text();
         var searchtarget = $(this).find( "div span" );
         console.log(searchtarget);

         var searchtarget_text = searchtarget.text();

         var between = search_text.split(searchtarget_text);
         var searchtarget_id = searchtarget.attr('id');
         console.dir(between)
         html1 = between[0] + searchtarget_text + ' [ <a href="#footnote_' +searchtarget_id+ '" id="target_' +searchtarget_id+ '">'+index_footnote+'</a> ] ' + between[1];

         target.html(html1);

         $('.footnote').append(html);
         $(this).remove();
    }

});


var the_search = $('.the_search').html();

var all_search = $('.the_text');

if (the_search) {
$.each( all_search, function( key, value ) {

    var the_text = $(this).text();

	var t = the_text.replace(the_search, '<span style="color:darkblue;font-weight:bold;">' + the_search + '</span>');
	$(this).html(t);

});
}


tag_json =  $('#tagclould').text();

if (tag_json) {
	var json_obj = JSON.parse(tag_json);

	var tagcloud_html = '<div class="tagsdiv">'
	$.each(json_obj, function(k, v) {
		v = v + 16;
		randomColor = Math.floor(Math.random()*16777215).toString(16);
		tagcloud_html = tagcloud_html + '<div class="single_tag" style="font-size:'+v+'px; padding:2px; height:22px; color:#'+randomColor+'"> '+k+' </div>';

	});
	 $('.tagdiv').html(tagcloud_html);
}



});






