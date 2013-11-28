from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Home
from images.models import Image, ImageCollection
from posts.models import Post
from project.models import Project


def first_page(request):
    try:
        home = Home.objects.filter(welcome_title='Articipation')
    except:
        home = 'no home'

    try:
        collection = ImageCollection.objects.get(pk=1)
    except:
        collection = 'no colletion'
    try:
        images = Image.objects.get(pk=1)
    except:
        images = 'no images'

    projects = Project.objects.filter(active=True)


    posts = Post.objects.filter(active=True)


    cases = Post.objects.filter(type='Cases')
    post_projects = Post.objects.filter(type='Projects')
    workshops = Post.objects.filter(type='Workshops')

    return render_to_response('home/index.html',
        {'home': home,
         'collection' : collection,
         'images': images,
          'posts': posts,
         'cases': cases,
         'projects': projects,
         'post_projects': post_projects,
         'workshops': workshops,
        },
        context_instance=RequestContext(request))
