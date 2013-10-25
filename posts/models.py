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

PROCESS = (
    ('Initiated', 'Initiated'),
    ('Completed', 'Completed'),
    ('Documented', 'Documented'),
    ('Reported', 'Reported'),
    ('Postprocess', 'Postprocess'),
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
    simple_text = models.BooleanField(default=False,
                help_text="is the post on build by text and not build by sections")
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
    process = models.CharField(max_length=12, choices=PROCESS)
    credits = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-publish_at',]
        verbose_name_plural = 'posts'

    def __unicode__(self):
        return u'%s' %self.title

    def process_procent(self):
        if (self.process == 'Initiated'):
            procent = 10
        elif (self.process == 'Completed'):
            procent = 50
        elif (self.process == 'Documented'):
            procent = 70
        elif (self.process == 'Reported'):
            procent = 90
        elif (self.process == 'Postprocess'):
            procent = 100
        else:
            procent = 0

        return procent


HEADING = (
    ('h1', 'h1'),
    ('h2', 'h2'),
    ('h3', 'h3'),
    ('h4', 'h4'),
    ('h5', 'h5'),
    )

class Section(models.Model):
    title = models.CharField(max_length=255, help_text="Title if the post. Can be anything up to 255 characters.", blank=True, null=True)
    level = models.CharField(max_length=12, choices=HEADING, help_text="Does the title have head style", default="h2", blank=True, null=True)
    body = models.TextField()
    post = models.ForeignKey(Post, help_text="What post does the paragraf belong to?", related_name="selection")


    def __unicode__(self):
        return u'paragraf belong to %s' %self.post

