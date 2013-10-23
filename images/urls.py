from django.conf.urls import patterns, url

urlpatterns = patterns('images.views',
    url(r'^$', 'index'),
    url(r'^(?P<slug>[a-zA-Z0-9_.-]+)/$', 'detailCollection'),
)


