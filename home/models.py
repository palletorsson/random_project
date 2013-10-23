from django.db import models

class Home(models.Model):
    welcome_title = models.CharField(max_length=255)
    welcome_text = models.TextField(help_text="This is the main part frontpage in html")
	 
    def __unicode__(self):
        return unicode("Edit the single Frontpage")
