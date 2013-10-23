# related/api.py
from tastypie.resources import ModelResource, ALL
from models import Related
from tastypie import fields
from posts.api import PostsResource




class RelatedResource(ModelResource):
    post = fields.ToOneField(PostsResource, 'post')


    class Meta:
        queryset = Related.objects.all()
        resource_name = 'related'
        filtering = {
            'post': ALL,
        }
