import requests
from django.shortcuts import render
from django.core.paginator import Paginator
from datetime import datetime
from django.db.models import Min, Max
from django.http import JsonResponse
from django.views import View
from .models import APOD, NeoWs, Developer, CommonQuestion
from .forms import ContactUsForm

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

class NeoWsView(View):
    template_name = 'space/neows.html'
    date = datetime.today().date()

    today = date.strftime("%Y-%m-%d")

    def get(self, requests):
        total = NeoWs.objects.count()
        stats = NeoWs.objects.aggregate(
            min_distance=Min("miss_distance"),
            max_diameter=Max("EsDiameter")
        )
        neows_count = NeoWs.objects.filter(date=self.today).count()
        neows_danger = NeoWs.objects.filter(is_dangerous=True).count()
        neows_safe = NeoWs.objects.filter(is_dangerous=False).count()

        danger_pct = round((neows_danger / total) * 100, 2) if total else 0
        

        context = {
            'neows_count': neows_count,
            'neows_danger': neows_danger,
            'neows_safe': neows_safe,
            'min_distance': stats["min_distance"],
            'max_diameter': stats["max_diameter"],
            'danger_pct': danger_pct,
        }

        return render(requests, self.template_name, context)

    def post(self, requests):
        page = int(requests.GET.get("page", 1))
        per_page = int(requests.GET.get("per_page", 6))

        neows = NeoWs.objects.all().order_by('-date')

        paginator = Paginator(neows, per_page)

        page_obj = paginator.get_page(page)

        data = []
        for neo in page_obj:
            data.append({
                'name': neo.name,
                'diameter': neo.EsDiameter,
                'is_dangerous': neo.is_dangerous,
                'miss_distance': neo.miss_distance,
                'nearest_approach': neo.nearest_approach,
                'relative_speed': neo.relative_speed,
            })

        response = {
            'neos': data,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        }

        return JsonResponse(response)
    
class AboutUsView(View):
    template_name = 'space/about-us.html'

    def get(self, requests):
        developers = Developer.objects.all()


        context = {
            'developers': developers,
        }

        return render(requests, self.template_name, context)
    
class ContactUsView(View):
    template_name = 'space/contact-us.html'

    def get(self, request):
        questions = CommonQuestion.objects.all()
        form = ContactUsForm()
        
        context = {
            'form': form,
            'questions': questions,
        }

        return render(request, self.template_name, context)

    def post(self, request):
        
        form = ContactUsForm(request.POST)
        if form.is_valid():
            form.save()

            return JsonResponse({'message': 'پیام شما با موفقیت دریافت شد'})
        else:
            return JsonResponse({'message': 'خطایی هنگام فرستادن پیام رخ داد!!!'}, status=400)

def fetch_astronauts(request):
    url = "http://api.open-notify.org/astros.json"
    response = requests.get(url)

    return JsonResponse(response.json())

def fetch_ISSLocation(request):
    url = "http://api.open-notify.org/iss-now.json"
    response = requests.get(url)

    return JsonResponse(response.json())

def page404(request, exception):
    return render(request, 'error/404.html', status=404)

def page403(request, exception):
    return render(request, 'error/403.html', status=403)

def page400(request, exception):
    return render(request, 'error/400.html', status=400)

def page500(request, exception):
    return render(request, 'error/500.html')
