# related/api.py
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from models import Post



class PostsResource(ModelResource):
    #related = fields.ToManyField('related.api.RelatedResource', 'related')

    class Meta:
        queryset = Post.objects.all()
        resource_name = 'posts'
