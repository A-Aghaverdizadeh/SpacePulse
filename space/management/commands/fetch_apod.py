import requests
from django.core.management.base import BaseCommand
from deep_translator import GoogleTranslator
from space.models import APOD

NASA_API_KEY = "add your own api key"
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"


class Command(BaseCommand):
    help = "Fetch NASA APOD and store in database"

    def handle(self, *args, **kwargs):
        params = {"api_key": NASA_API_KEY}
        response = requests.get(NASA_APOD_URL, params=params)
        data = response.json()

        # ترجمه به فارسی
        translator = GoogleTranslator(source='en', target='fa')
        title_fa = translator.translate(data.get("title", ""))
        explanation_fa = translator.translate(data.get("explanation", ""))

        # ذخیره در دیتابیس (یا به‌روزرسانی اگه رکورد وجود داره)
        apod, created = APOD.objects.update_or_create(
            date=data.get("date"),
            defaults={
                "title_en": data.get("title"),
                "title_fa": title_fa,
                "explanation_en": data.get("explanation"),
                "explanation_fa": explanation_fa,
                "image_url": data.get("url"),
                "media_type": data.get("media_type"),
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"APOD for {apod.date} saved."))
        else:
            self.stdout.write(self.style.WARNING(f"APOD for {apod.date} updated."))