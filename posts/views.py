from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from related.models import Related
from datetime import datetime
from models import Post

def index(request):
    posts = Post.objects.filter(active=True)
    return render_to_response('posts/index.html', {
        'posts': posts,
    }, context_instance=RequestContext(request))
    
def detail(request, slug):
    post = get_object_or_404(Post, slug=slug)

    related = Related.objects.filter(post=post)

    return render_to_response('posts/detail.html', {
        'post': post,
        'related':related,
    }, context_instance=RequestContext(request))

def by_type(request, key):
    posts = Post.objects.filter(type = key, active=True)
    type = key

    return render_to_response('posts/index.html', {
        'posts': posts,
        'type': type,
    }, context_instance=RequestContext(request))


def timeline(request, key):
    posts = Post.objects.filter(active=True)
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

    print posts[0].days_ago

    return render_to_response('posts/timeline.html', {
        'posts': posts,
        'draw': draw,
        'today':today,
    }, context_instance=RequestContext(request))
