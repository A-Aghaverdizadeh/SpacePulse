from django.shortcuts import render
from django.views import View

NASA_API_KEY = "qgHYxv1XyGpEmgzlas7hp8QhesvIW7GDJYvD0QCc"
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

class HomePage(View):
    template_name = 'space/home.html'

    def get(self, requests):

        context = {

        }

        return render(requests, self.template_name, context)

