import datetime

from django.db import models
from django.contrib.auth.models import User
from tinymce import models as tinymce_models
from filebrowser.fields import FileBrowseField

#from ckeditor.fields import RichTextField
#from taggit.managers import TaggableManager


TYPE_OF_POST = (
    ('Cases', 'Case'),
    ('Projects', 'Project'),
    ('Definitions', 'Definition'),
    ('Workshops', 'Workshops'),
    ('Pages', 'Pages'),
    )

class PostManager(models.Manager):
    def get_visible(self):
        return self.get_query_set().filter(publish_at__lte=datetime.datetime.now(), active=True)

class Blog(models.Model):

    """
    A blog beloinging to a user.
    Blogs have multipul posts and on user can have many blogs
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, related_name="blogs")

    
    def __unicode__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=255, help_text="Title if the post. Can be anything up to 255 characters.")
    slug = models.SlugField()
    excerpt = models.TextField()
    html_text = tinymce_models.HTMLField()
    the_text = models.TextField()
    image = FileBrowseField("Image", max_length=200, directory="images/", extensions=[".jpg"], blank=True, null=True)
    author = models.ForeignKey(User, help_text="you are posting.", related_name="posts")
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_modified = models.DateTimeField(auto_now=True)
    publish_at = models.DateTimeField(default=datetime.datetime.now(),
        help_text="Date and time post should become visible")
    realtime_started = models.DateTimeField(blank=True, null=True)
    realtime_ended = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=False,
                help_text="Controls whether or not this item is visable on the site.")
    #tags = TaggableManager()
    blog = models.ForeignKey(Blog, help_text="What blog does the post belong to?", related_name="posts")
    type = models.CharField(max_length=40, choices=TYPE_OF_POST)

    class Meta:
        ordering = ['-publish_at',]
        verbose_name_plural = 'posts'

    def __unicode__(self):
        return u'%s' %self.title