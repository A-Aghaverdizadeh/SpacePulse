import os
import requests
from dotenv import load_dotenv, find_dotenv
from django.core.management.base import BaseCommand
from cerebras.cloud.sdk import Cerebras
from space.models import APOD

load_dotenv(find_dotenv())

NASA_API_KEY = os.environ.get("NASA_API_KEY")
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

client = Cerebras(
    api_key=os.environ.get("Cerebras_Key"),
)

class Command(BaseCommand):
    help = "Fetch NASA APOD and store in database"

    def handle(self, *args, **kwargs):
        # 1. گرفتن داده از NASA
        params = {"api_key": NASA_API_KEY}
        response = requests.get(NASA_APOD_URL, params=params)
        data = response.json()

        explanation_en = data.get("explanation", "")
        title_en = data.get("title", "")

        # 2. ترجمه با Cerebras
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": f"Translate this to Persian:\nTitle: {title_en}\n\n{explanation_en}"}
            ],
            model="llama-4-scout-17b-16e-instruct",
        )

        translated_text = chat_completion.choices[0].message.content

        title_fa = translated_text.split("\n")[0] if "\n" in translated_text else translated_text
        explanation_fa = translated_text

        # 3. ذخیره در دیتابیس
        apod, created = APOD.objects.update_or_create(
            date=data.get("date"),
            defaults={
                "title_en": title_en,
                "title_fa": title_fa,
                "explanation_en": explanation_en,
                "explanation_fa": explanation_fa,
                "image_url": data.get("url"),
                "media_type": data.get("media_type"),
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"APOD for {apod.date} saved."))
        else:
            self.stdout.write(self.style.WARNING(f"APOD for {apod.date} updated."))