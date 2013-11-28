#-*-coding:utf-8-*-

from django.db import models
from django.contrib.auth.models import User
from filebrowser.fields import FileBrowseField
import datetime
from posts.models import Post


TYPE_OF_PROJECT = (
    ('Cases', 'Case'),
    ('Projects', 'Project'),
    ('Workshops', 'Workshops'),
    ('Installation', 'Installation'),
    )

PROCESS = (
    ('Initiated', 'Initiated'),
    ('Announced', 'Announced'),
    ('Program', 'Program'),
    ('Completed', 'Completed'),
    ('Documented', 'Documented'),
    ('Reported', 'Reported'),
    ('Post_process', 'Post_process'),
    )

class Project(models.Model):
    title = models.CharField(max_length=255, help_text="Title if the project. Can be anything up to 255 characters.")
    slug = models.SlugField()
    announce = models.CharField(max_length=255, help_text="Can be anything up to 255 characters.")
    summery = models.TextField()
    image = FileBrowseField("Image", max_length=200, directory="images/", extensions=[".jpg"], blank=True, null=True)
    author = models.ForeignKey(User, help_text="who is posting.")
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_modified = models.DateTimeField(auto_now=True)
    publish_at = models.DateTimeField(default=datetime.datetime.now(),
        help_text="Date and time post should become visible")
    realtime_started = models.DateTimeField(blank=True, null=True)
    realtime_ended = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=False,
                help_text="Controls whether or not this item is visable on the site.")
    posts = models.ManyToManyField(Post, help_text="What blog does the post belong to?", related_name="posts")
    type = models.CharField(max_length=40, choices=TYPE_OF_PROJECT)
    process = models.CharField(max_length=12, choices=PROCESS)
    credits = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-publish_at',]
        verbose_name_plural = 'projects'


    def __unicode__(self):
        return u'%s' %self.title

    def process_procent(self):
        if (self.process == 'Initiated'):
            procent = 10
        elif (self.process == 'Announced'):
            procent = 20
        elif (self.process == 'Program'):
            procent = 40
        elif (self.process == 'Completed'):
            procent = 50
        elif (self.process == 'Documented'):
            procent = 70
        elif (self.process == 'Reported'):
            procent = 95
        elif (self.process == 'Postprocess'):
            procent = 100
        else:
            procent = 0

        return procent

