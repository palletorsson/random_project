from django.contrib import admin
from models import Project

class PostAdmin(admin.ModelAdmin):
    list_display = ('active', 'title', )


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'summery','active', )
    list_display_links = ('title', )
    list_editable = ('active',)
    list_filter = ('active', )
    prepopulated_fields = {'slug':('title',),}

admin.site.register(Project, ProjectAdmin)
