from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Home
from images.models import Image, ImageCollection
from posts.models import Post

def first_page(request):
    home = Home.objects.get(pk=1)
    try:
        collection = ImageCollection.objects.get(pk=1)
    except:
        collection = 'no colletion'
    try:
        images = Image.objects.get(pk=1)
    except:
        images = 'no images'
    
    posts = Post.objects.filter(active=True)
    cases = Post.objects.filter(type='Cases')
    projects = Post.objects.filter(type='Projects')
    workshops = Post.objects.filter(type='Workshops')

    return render_to_response('home/index.html',
        {'home': home,
         'collection' : collection,
         'images': images,
          'posts': posts,
         'cases': cases,
         'projects': projects,
         'workshops': workshops,
        },
        context_instance=RequestContext(request))
