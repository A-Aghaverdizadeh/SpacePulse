from django.utils.html import format_html
from django.contrib import admin
from .models import APOD, NeoWs, Developer

admin.site.register(APOD)

# admin.site.register(NeoWs)

@admin.register(NeoWs)
class NeoWsAdmin(admin.ModelAdmin):
    list_display = ['nasa_id' ,'name', 'date', 'is_dangerous', 'miss_distance']
    list_filter = ['is_dangerous']

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['profile_small_preview', 'name', 'Position']
    fieldsets = (
        (None, {
            'fields': ('profile_preview', 'profile', 'name', 'Position', 'description', 'github', 'instagram', 'telegram')
        }),
    )
    readonly_fields = ['profile_preview']

    def profile_preview(self, obj):
        """ Display image preview inline if available. """
        if obj.profile:
            return format_html(f'<img src="{obj.profile.url}" style="max-width:200px; max-height:200px"/>')
        return "No Image"
    
    def profile_small_preview(self, obj):
        """ Display image preview inline if available. """
        if obj.profile:
            return format_html(f'<img src="{obj.profile.url}" style="max-width:40px; max-height:40px"/>')
        return "No Image"