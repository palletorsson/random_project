from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from filebrowser.sites import site
#from tastypie.api import Api
from related.api.resources import RelatedResource
from related.api.resources import PostsResource

related_resource = RelatedResource()
posts_resource = PostsResource()

admin.autodiscover()


urlpatterns = patterns('',
    url(r'^$', 'home.views.first_page', name='index'),
    url(r'^posts/', include('posts.urls')),
    url(r'^admin/', include(admin.site.urls)),
    (r'^grappelli/', include('grappelli.urls')), # grappelli URLS
    url(r'^admin/filebrowser/', include(site.urls)),
    (r'^tinymce/', include('tinymce.urls')),
)

urlpatterns += patterns('',
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    (r'^theme/static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_URL}),
    (r'^related/', include('related.urls')),
    (r'^images/', include('images.urls')),
    (r'^api/', include(related_resource.urls)),
    (r'^api/', include(posts_resource.urls)),
     url(r'^post/comments/', include('django.contrib.comments.urls')),

)



