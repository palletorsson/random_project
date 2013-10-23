from django.db import models
from filebrowser.fields import FileBrowseField

class ImageCollection(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    feature_image = FileBrowseField("Image", max_length=200, directory="images/", extensions=[".jpg"], blank=True, null=True)

    def __unicode__(self):
        return unicode(self.name)

    class Meta:
        verbose_name_plural = 'galleries'

class Photographer(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)

    def __unicode__(self):
        return unicode(self.name)

class Image(models.Model):
    name= models.CharField(max_length=255, default=" ",)
    image = FileBrowseField("Image", max_length=200, directory="images/", extensions=[".jpg"], blank=True, null=True)
    photographer = models.ForeignKey(Photographer, blank=True, null=True)
    image_collection = models.ForeignKey(ImageCollection, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    
    def __unicode__(self):
        return unicode(self.name)




    