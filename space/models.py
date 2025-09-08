from django.db import models


# APOD defines: Astronomy Picture of the Day

class APOD(models.Model):
    date = models.DateField(unique=True)
    title_en = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255, null=True, blank=True)
    explanation_en = models.TextField()
    explanation_fa = models.TextField(null=True, blank=True)
    image_url = models.URLField()
    media_type = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"APOD {self.date}"
    

# NeoWs defines: Near Earth Object Web Service 

class NeoWs(models.Model):
    nasa_id = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    name = models.CharField(max_length=264) #
    EsDiameter = models.FloatField() #
    is_dangerous = models.BooleanField(default=False) #
    miss_distance = models.FloatField() #
    nearest_approach = models.CharField(max_length=50) #
    relative_speed = models.FloatField() #

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"NeoWs {self.name}"


class Developer(models.Model):
    profile = models.ImageField(upload_to='profile')
    name = models.CharField(max_length=264)
    Position = models.CharField(max_length=264)
    description = models.TextField()
    github = models.CharField(max_length=400)
    instagram = models.CharField(max_length=400)
    telegram = models.CharField(max_length=400)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

class ContactUs(models.Model):
    full_name = models.CharField(max_length=264)
    email = models.EmailField()
    subject = models.CharField(max_length=1000)
    description = models.CharField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
    
