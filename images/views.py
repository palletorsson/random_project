from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Image, ImageCollection

def index(request):
    images_collection = ImageCollection.objects.all()
    return render_to_response('images/index.html', {
        'images_collection': images_collection,
    }, context_instance=RequestContext(request))



def detailCollection(request, slug):
    image_collection = Image.objects.filter(image_collection__slug=slug)
    the_collection = ImageCollection.objects.get(slug=slug)
    return render_to_response('images/collection.html', {
        'image_collection': image_collection,
         'the_collection': the_collection,
    }, context_instance=RequestContext(request))