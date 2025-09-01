from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from .models import APOD

class HomePage(View):
    template_name = 'space/home.html'

    def get(self, requests):

        context = {

        }

        return render(requests, self.template_name, context)

    def post(self, requests):
        apod = APOD.objects.order_by('-date').first()

        data = {
            'title_fa': apod.title_fa,
            'explanation_fa': apod.explanation_fa,
            'image': apod.image_url,
            'date': apod.date,
            'media_type': apod.media_type,
            'url': apod.image_url,
        }

        return JsonResponse({'data': data})
    
class BlogPage(View):
    template_name = 'space/blog.html'

    def get(self, requests):

        context = {

        }

        return render(requests, self.template_name, context)
    
    def post(self, requests):
        pass
