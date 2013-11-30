from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from home.models import Home
from images.models import Image, ImageCollection
from posts.models import Post
from project.models import Project
from datetime import datetime


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

def index(request):
    projects = Project.objects.filter(active=True)
    return render_to_response('project/index.html', {
        'posts': projects,
    }, context_instance=RequestContext(request))


def detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render_to_response('project/detail.html', {
        'project': project,
    }, context_instance=RequestContext(request))


def timeline(request, key):
    posts = Project.objects.filter(active=True)
    draw = 19
    started = datetime(2012, 1, 1).date()
    i = 0
    width = 3 * 12 * 70 #2590
    alltime = datetime(2014, 12, 30).date() - started
    alltimenum = alltime.days #1040
    powervalue = float(width)/float(alltimenum)
    today = datetime.now().date() - started
    today = int(((today.days * powervalue)))

    for post in posts:
        lan = post.realtime_started.date() - started
        duration = post.realtime_ended.date() - post.realtime_started.date()
        posts[i].days_ago = int(((lan.days * powervalue)))
        posts[i].duration = int(duration.days * powervalue)
        print posts[i].days_ago
        i = i + 1


    return render_to_response('project/timeline.html', {
        'posts': posts,
        'draw': draw,
        'today':today,
    }, context_instance=RequestContext(request))
