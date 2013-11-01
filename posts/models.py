#-*-coding:utf-8-*-

import datetime

from django.db import models
from django.contrib.auth.models import User
from tinymce import models as tinymce_models
from filebrowser.fields import FileBrowseField
from string import punctuation
import re
import json
from django.dispatch import receiver
from HTMLParser import HTMLParser
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

    def getTagSorted(self):
        N = 1000
        words = {}
        keep_list = []
        taglist = []
        start_exclude_list = u"The They a's able about above a i according accordingly across actually after afterwards again against ain't all allow allows almost alone along already also although always am among amongst an and another any anybody anyhow anyone anything anyway anyways anywhere apart appear appreciate appropriate are aren't around as aside ask asking associated at available away awfully be became because become becomes becoming been before beforehand behind being believe below beside besides best better between beyond both brief but by c'mon c's came can can't cannot cant cause causes certain certainly changes clearly co com come comes concerning consequently consider considering contain containing contains corresponding could couldn't course currently definitely described despite did didn't different do does doesn't doing don't done down downwards during each edu eg eight either else elsewhere enough entirely especially et etc even ever every everybody everyone everything everywhere ex exactly example except far few fifth first five followed following follows for former formerly forth four from further furthermore get gets getting given gives go goes going gone got gotten greetings had hadn't happens hardly has hasn't have haven't having he he's hello help hence her here here's hereafter hereby herein hereupon hers herself hi him himself his hither hopefully how howbeit however i'd i'll i'm i've ie if ignored immediate in inasmuch inc indeed indicate indicated indicates inner insofar instead into inward is isn't it it'd it'll it's its itself just keep keeps kept know known knows last lately later latter latterly least less lest let let's like liked likely little look looking looks ltd mainly many may maybe me mean meanwhile merely might more moreover most mostly much must my myself name namely nd near nearly necessary need needs neither never nevertheless new next nine no nobody non none noone nor normally not nothing novel now nowhere obviously of off often oh ok okay old on once one ones only onto or other others otherwise ought our ours ourselves out outside over overall own particular particularly per perhaps placed please plus possible presumably probably provides que quite qv rather rd re really reasonably regarding regardless regards relatively respectively right said same saw say saying says second secondly see seeing seem seemed seeming seems seen self selves sensible sent serious seriously seven several shall she should shouldn't since six so some somebody somehow someone something sometime sometimes somewhat somewhere soon sorry specified specify specifying still sub such sup sure t's take taken tell tends th than thank thanks thanx that that's thats the their theirs them themselves then thence there there's thereafter thereby therefore therein theres thereupon these they they'd they'll they're they've think third this thorough thoroughly those though three through throughout thru thus to together too took toward towards tried tries truly try trying twice two un under unfortunately unless unlikely until unto up upon us use used useful uses using usually value various very via viz vs want wants was wasn't way we we'd we'll we're we've welcome well went were weren't what what's whatever when whence whenever where where's whereafter whereas whereby wherein whereupon wherever whether which while whither who who's whoever whole whom whose why will willing wish with within without won't wonder would wouldn't yes yet you you'd you'll you're you've your yours yourself yourselves zero"

        exclude_list = start_exclude_list

        exclude_list = exclude_list.split()
        section_words = u' %s' % self.the_text
        section_words = section_words.strip(punctuation).lower()
        section_words =  re.sub('<[^<]+?>', '', section_words)
        section_words =  re.sub(r'[^\w\s]', '', section_words)


        section_words = section_words.split()
        words_gen = []


        for word in section_words:
            words_gen.append(word)


        for word in words_gen:
            if word not in exclude_list:
                keep_list.append(word)


        for word in keep_list:
            words[word] = words.get(word, 0) + 1

        top_words = sorted(words.iteritems(),
            key=lambda(word, count): (-count, word))[:N]

        for word, frequency in top_words:
            if (frequency > 2):
                taglist.append((word, frequency))

        taglist = {word: frequency for (word, frequency) in taglist}
        data  = json.dumps(taglist)

        return data


class ReseachMainline(models.Model):
    body = models.CharField(max_length=255, help_text="the main research line", blank=True, null=True)

    def __unicode__(self):
        return u' %s' % self.body



HEADING = (
    ('h1', 'h1'),
    ('h2', 'h2'),
    ('h3', 'h3'),
    ('h4', 'h4'),
    ('h5', 'h5'),
    )


TYPE_OF_SECTION = (
    ('default', 'default'),
    ('quote', 'quote'),
    )


class Section(models.Model):
    title = models.CharField(max_length=255, help_text="Title if the post. Can be anything up to 255 characters.", blank=True, null=True)
    level = models.CharField(max_length=12, choices=HEADING, help_text="Does the title have head style", default="h2", blank=True, null=True)
    body = models.TextField()
    post = models.ForeignKey(Post, help_text="What post does the paragraf belong to?", related_name="selection")
    line = models.ForeignKey(ReseachMainline, help_text="does this section add to the main research line", blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=12, choices=TYPE_OF_SECTION, help_text="Does the title have head style", default="default")

    def getTagSorted(self):
        N = 1000
        words = {}
        keep_list = []
        taglist = []
        start_exclude_list = "The They a's able about above a i according accordingly across actually after afterwards again against ain't all allow allows almost alone along already also although always am among amongst an and another any anybody anyhow anyone anything anyway anyways anywhere apart appear appreciate appropriate are aren't around as aside ask asking associated at available away awfully be became because become becomes becoming been before beforehand behind being believe below beside besides best better between beyond both brief but by c'mon c's came can can't cannot cant cause causes certain certainly changes clearly co com come comes concerning consequently consider considering contain containing contains corresponding could couldn't course currently definitely described despite did didn't different do does doesn't doing don't done down downwards during each edu eg eight either else elsewhere enough entirely especially et etc even ever every everybody everyone everything everywhere ex exactly example except far few fifth first five followed following follows for former formerly forth four from further furthermore get gets getting given gives go goes going gone got gotten greetings had hadn't happens hardly has hasn't have haven't having he he's hello help hence her here here's hereafter hereby herein hereupon hers herself hi him himself his hither hopefully how howbeit however i'd i'll i'm i've ie if ignored immediate in inasmuch inc indeed indicate indicated indicates inner insofar instead into inward is isn't it it'd it'll it's its itself just keep keeps kept know known knows last lately later latter latterly least less lest let let's like liked likely little look looking looks ltd mainly many may maybe me mean meanwhile merely might more moreover most mostly much must my myself name namely nd near nearly necessary need needs neither never nevertheless new next nine no nobody non none noone nor normally not nothing novel now nowhere obviously of off often oh ok okay old on once one ones only onto or other others otherwise ought our ours ourselves out outside over overall own particular particularly per perhaps placed please plus possible presumably probably provides que quite qv rather rd re really reasonably regarding regardless regards relatively respectively right said same saw say saying says second secondly see seeing seem seemed seeming seems seen self selves sensible sent serious seriously seven several shall she should shouldn't since six so some somebody somehow someone something sometime sometimes somewhat somewhere soon sorry specified specify specifying still sub such sup sure t's take taken tell tends th than thank thanks thanx that that's thats the their theirs them themselves then thence there there's thereafter thereby therefore therein theres thereupon these they they'd they'll they're they've think third this thorough thoroughly those though three through throughout thru thus to together too took toward towards tried tries truly try trying twice two un under unfortunately unless unlikely until unto up upon us use used useful uses using usually value various very via viz vs want wants was wasn't way we we'd we'll we're we've welcome well went were weren't what what's whatever when whence whenever where where's whereafter whereas whereby wherein whereupon wherever whether which while whither who who's whoever whole whom whose why will willing wish with within without won't wonder would wouldn't yes yet you you'd you'll you're you've your yours yourself yourselves zero"
        exclude_list = start_exclude_list
        exclude_list = exclude_list.split()
        section_words = self.body
        section_words = section_words.split()
        words_gen = []


        for word in section_words:
            words_gen.append(word)
        print words_gen

        for word in words_gen:
            if word not in exclude_list:
                keep_list.append(word)

        print keep_list
        for word in keep_list:
            words[word] = words.get(word, 0) + 1

        top_words = sorted(words.iteritems(),
            key=lambda(word, count): (-count, word))[:N]

        for word, frequency in top_words:
            taglist.append((word, frequency))

        return taglist

    def __unicode__(self):
        return u'paragraf belong to the post %s and is the %s section' % (self.post, self.pk)


@receiver(models.signals.post_save, sender=Post)
def execute_after_save(sender, instance, created, *args, **kwargs):
    if created:
        all = instance.the_text
        sections = all.split('\n\r')

        for section_text in sections:
            new_section = Section(body=section_text)
            new_section.post = instance
            new_section.save()



