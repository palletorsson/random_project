var imgPattern1=new RegExp('^/(Pages|PageFiles|Global)/'),
imgPattern2=new RegExp('^/Images/'),
imgPattern3=new RegExp('^/ImageHandler.axd?');
$(function(){
    $('img').each(function(el,i){
        var $this=$(this);
       $this.error(function(){retryLoad($this);});
    });
});
function retryLoad(el){
    var src=el.attr('src');
    if (!src||src=='') {
        return;
    };
    if (imgPattern1.test(src)||imgPattern2.test(src)||imgPattern3.test(src)) {
        src=src.indexOf('?')==-1?src+'?retry=1':src+'&retry=1';
        el.attr('src',src);
        el.unbind('error');
    };    
}