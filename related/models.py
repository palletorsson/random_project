from django.db import models
from django.contrib.auth.models import User
from posts.models import Post
from images.models import Image, ImageCollection


TYPE_OF_RELATED = (
    ('N', 'Note'),
    ('L', 'Link'),
    ('I', 'Image'),
    ('C', 'ImageCollection'),
    ('V', 'Video'),
    ('2', 'LinkAndNote'),
    ('4', 'ImageAndNote'),
    ('6', 'LinkCollectionAndNote'),
    ('8', 'VideoAndNote')
    )

class Related(models.Model):
    post = models.ForeignKey(Post, help_text="This is the post of this relation")
    author = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True, help_text="This is a note for the post")
    link = models.TextField(null=True, blank=True, help_text="This is a link in its own right or to a note")
    image = models.ForeignKey(Image, default=1, null=True, blank=True)
    image_collection = models.ForeignKey(ImageCollection, default=1, null=True, blank=True)
    top = models.IntegerField()
    anchor = models.CharField(max_length=255, help_text="Related to the anchor in the text")
    type = models.CharField(max_length=1, choices=TYPE_OF_RELATED, blank=True)
    active = models.BooleanField("Active", default=True)


    def __unicode__(self):
        return u'Related to %s and anchor: %s' % (self.post, self.anchor)
