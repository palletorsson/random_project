from django.contrib import admin
from models import Home

class HomeAdmin(admin.ModelAdmin):
    model = Home

admin.site.register(Home, HomeAdmin)

