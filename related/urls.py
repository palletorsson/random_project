from django.conf.urls import patterns, url

urlpatterns = patterns('related.views',
    url(r'^$', 'index'),
)