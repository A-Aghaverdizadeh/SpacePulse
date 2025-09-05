from django.contrib import admin
from .models import APOD, NeoWs

admin.site.register(APOD)

# admin.site.register(NeoWs)

@admin.register(NeoWs)
class NeoWsAdmin(admin.ModelAdmin):
    list_display = ['nasa_id' ,'name', 'date', 'is_dangerous', 'miss_distance']
    list_filter = ['is_dangerous']