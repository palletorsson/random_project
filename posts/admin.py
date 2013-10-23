from django.contrib import admin
from models import Blog, Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('active', 'title', )
    list_display_links = ('title',)
    list_editable = ('active',)
    list_filter = ('active', )
    prepopulated_fields = {'slug':('title',),}


admin.site.register(Post, PostAdmin)
admin.site.register(Blog)
