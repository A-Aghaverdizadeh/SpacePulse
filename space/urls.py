from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePage.as_view(), name='home'),
    path('blog', views.BlogPage.as_view(), name='blog'),
    path('neows', views.NeoWsView.as_view(), name='neows'),
    path('about-us', views.AboutUsView.as_view(), name='about-us'),
    path('contact-us', views.ContactUsView.as_view(), name='contact-us'),
    path('proxy/astronauts', views.fetch_astronauts, name='astronauts'),
    path('proxy/ISSLocation', views.fetch_ISSLocation, name='ISSLocation'),
]
