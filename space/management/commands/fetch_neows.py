import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv, find_dotenv
from django.core.management.base import BaseCommand
from space.models import NeoWs

load_dotenv(find_dotenv())

NASA_API_KEY = os.environ.get("NASA_API_KEY")
NASA_APOD_URL = "https://api.nasa.gov/neo/rest/v1/feed"

class Command(BaseCommand):

    help = 'fetch Nasa NeoWs and store it to the database'

    def get_neows_data(self, start_date, end_date):
        params = {
            "start_date": start_date,
            "end_date": end_date,
            "api_key": NASA_API_KEY,
        }
        response = requests.get(NASA_APOD_URL, params=params)
        data = response.json()
        return data

    def handle(self, *args, **options):
        today = datetime.today().date()
        seven_days_later = today + timedelta(days=7)

        start_date = today.strftime("%Y-%m-%d")
        end_date = seven_days_later.strftime("%Y-%m-%d")

        data = self.get_neows_data(start_date, end_date)

        for date, objects in data["near_earth_objects"].items():
            for obj in objects:
                neo_id = obj["id"]
                name = obj["name"]
                diameter = obj["estimated_diameter"]["meters"]["estimated_diameter_max"]
                hazardous = obj["is_potentially_hazardous_asteroid"]
                # miss_distance = obj["close_approach_data"][0]["miss_distance"]["kilometers"]
                # approach = obj["close_approach_data"][0]["close_approach_date_full"]

                approach = obj["close_approach_data"][0]
                miss_distance = approach["miss_distance"]["kilometers"]
                approach_date = approach["close_approach_date_full"]
                relative_speed = approach["relative_velocity"]["kilometers_per_second"]
                
                neows, created = NeoWs.objects.update_or_create(
                    nasa_id=neo_id,
                    defaults={
                        'date': date,
                        'name': name,
                        'EsDiameter': diameter,
                        'is_dangerous': hazardous,
                        'nearest_approach': approach_date,
                        'miss_distance': miss_distance,
                        'relative_speed': relative_speed,
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"NeoWs for {neows.date} saved."))
                else:
                    self.stdout.write(self.style.WARNING(f"NeoWs for {neows.date} updated."))
