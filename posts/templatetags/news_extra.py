from django import template
from django.templatetags.static import register
from posts.models import Post

register = template.Library()

#@register.inclusion_tag('base.html')
def show_news():
    news = Post.objects.filter(active=True, blog=2).order_by('-publish_at')[:4]

    return {'posts': posts}

register.inclusion_tag('posts/news_list.html')(show_news)
