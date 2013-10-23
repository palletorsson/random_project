# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'ImageCollection.slug'
        db.add_column(u'images_imagecollection', 'slug',
                      self.gf('django.db.models.fields.SlugField')(default='ee', max_length=50),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'ImageCollection.slug'
        db.delete_column(u'images_imagecollection', 'slug')


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
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        u'images.photographer': {
            'Meta': {'object_name': 'Photographer'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['images']