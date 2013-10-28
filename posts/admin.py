from django.contrib import admin
from models import Blog, Post, Section, ReseachMainline

class PostAdmin(admin.ModelAdmin):
    list_display = ('active', 'title', )
    list_display_links = ('title',)
    list_editable = ('active',)
    list_filter = ('active', )
    prepopulated_fields = {'slug':('title',),}

class SectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'body', )
    list_display_links = ('body', )

admin.site.register(Section, SectionAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Blog)
admin.site.register(ReseachMainline)