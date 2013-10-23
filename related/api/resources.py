#relation/api/resources.py
from tastypie import fields
from tastypie.resources import ModelResource, ALL
from related.models import Related
from posts.models import Post
from images.models import Image, ImageCollection




class PostsResource(ModelResource):
    related = fields.ToManyField('related.api.resources.RelatedResource', 'related', null=True, blank=True, related_name='post')

    class Meta:
        queryset = Post.objects.all()

class ImageResource(ModelResource):
    related = fields.ToManyField('related.api.resources.RelatedResource', 'related', null=True, blank=True, related_name='image')

    class Meta:
        queryset = Image.objects.all()

class ImageCollectionResource(ModelResource):
    related = fields.ToManyField('related.api.resources.RelatedResource', 'related', null=True, blank=True, related_name='image_collection', full=True)

    class Meta:
        queryset = ImageCollection.objects.all()


class RelatedResource(ModelResource):
    post = fields.ToOneField(PostsResource, 'post')
    image = fields.ToOneField(ImageResource, 'image', null=True, blank=True, full=True)

    class Meta:
        queryset = Related.objects.all()
        filtering = {
            "post": ALL,
        }

    def dehydrate(self, bundle):
        images = Image.objects.filter(image_collection=1)
        image_array = []
        for image in images:
            image_array.append(image.image)

        bundle.data['images'] = image_array

        #bundle.data['image_collection'] image_collection
        return bundle
