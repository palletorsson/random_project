from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from related.models import Related

from models import Post, Section
import operator
from django.db.models import Q


def index(request):
    posts = Post.objects.filter(active=True)
    return render_to_response('posts/index.html', {
        'posts': posts,
    }, context_instance=RequestContext(request))
    
def detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    sections = Section.objects.filter(post=post)
    related = Related.objects.filter(section=post)


    return render_to_response('posts/detail.html', {
        'post': post,
        'sections':sections
    }, context_instance=RequestContext(request))


def by_type(request, key):
    posts = Post.objects.filter(type = key, active=True)
    type = key

    return render_to_response('posts/index.html', {
        'posts': posts,
        'type': type,
    }, context_instance=RequestContext(request))




