# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ImageCollection'
        db.create_table(u'images_imagecollection', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('created_date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('feature_image', self.gf('filebrowser.fields.FileBrowseField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal(u'images', ['ImageCollection'])

        # Adding model 'Photographer'
        db.create_table(u'images_photographer', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal(u'images', ['Photographer'])

        # Adding model 'Image'
        db.create_table(u'images_image', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(default=' ', max_length=255)),
            ('image', self.gf('filebrowser.fields.FileBrowseField')(max_length=200, null=True, blank=True)),
            ('photographer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['images.Photographer'], null=True, blank=True)),
            ('image_collection', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['images.ImageCollection'], null=True, blank=True)),
            ('order', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'images', ['Image'])


    def backwards(self, orm):
        # Deleting model 'ImageCollection'
        db.delete_table(u'images_imagecollection')

        # Deleting model 'Photographer'
        db.delete_table(u'images_photographer')

        # Deleting model 'Image'
        db.delete_table(u'images_image')


    models = {
        u'images.image': {
            'Meta': {'object_name': 'Image'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('filebrowser.fields.FileBrowseField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'image_collection': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['images.ImageCollection']", 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "' '", 'max_length': '255'}),
            'order': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'photographer': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['images.Photographer']", 'null': 'True', 'blank': 'True'})
        },
        u'images.imagecollection': {
            'Meta': {'object_name': 'ImageCollection'},
            'created_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'feature_image': ('filebrowser.fields.FileBrowseField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'images.photographer': {
            'Meta': {'object_name': 'Photographer'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['images']