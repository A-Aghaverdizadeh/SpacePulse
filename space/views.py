from django.shortcuts import render
from django.views import View

class HomePage(View):
    template_name = 'space/home.html'

    def get(self, requests):

        context = {

        }

        return render(requests, self.template_name, context)

