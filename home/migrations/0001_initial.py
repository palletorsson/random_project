# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Home'
        db.create_table(u'home_home', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('welcome_tile', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('welcome_text', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'home', ['Home'])


    def backwards(self, orm):
        # Deleting model 'Home'
        db.delete_table(u'home_home')


    models = {
        u'home.home': {
            'Meta': {'object_name': 'Home'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'welcome_text': ('django.db.models.fields.TextField', [], {}),
            'welcome_tile': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['home']