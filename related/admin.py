from django.contrib import admin
from models import Related

class RelatedAdmin(admin.ModelAdmin):
    list_display = ('anchor', 'post', 'top', )
    list_display_links = ('anchor',)


admin.site.register(Related, RelatedAdmin)

