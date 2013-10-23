from django.conf.urls import patterns, url

urlpatterns = patterns('posts.views',
    url(r'^$', 'index'),
    url(r'^type/(?P<key>[a-zA-Z0-9_.-]+)/$', 'by_type'),
    url(r'^(?P<slug>[a-zA-Z0-9_.-]+)/$', 'detail'),
    url(r'^timeline/(?P<key>[a-zA-Z0-9_.-]+)/$', 'timeline'),
)


