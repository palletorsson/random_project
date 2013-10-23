# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Home.welcome_tile'
        db.delete_column(u'home_home', 'welcome_tile')

        # Adding field 'Home.welcome_title'
        db.add_column(u'home_home', 'welcome_title',
                      self.gf('django.db.models.fields.CharField')(default=1, max_length=255),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Home.welcome_tile'
        db.add_column(u'home_home', 'welcome_tile',
                      self.gf('django.db.models.fields.CharField')(default=1, max_length=255),
                      keep_default=False)

        # Deleting field 'Home.welcome_title'
        db.delete_column(u'home_home', 'welcome_title')


    models = {
        u'home.home': {
            'Meta': {'object_name': 'Home'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'welcome_text': ('django.db.models.fields.TextField', [], {}),
            'welcome_title': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['home']