from django.db import models

class APOD(models.Model):
    date = models.DateField(unique=True)
    title_en = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255, null=True, blank=True)
    explanation_en = models.TextField()
    explanation_fa = models.TextField(null=True, blank=True)
    image_url = models.URLField()
    media_type = models.CharField(max_length=20)

    def __str__(self):
        return f"APOD {self.date}"
    
