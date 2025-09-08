from django import forms
from .models import ContactUs

class ContactUsForm(forms.ModelForm):
    
    class Meta:
        model = ContactUs
        fields = ['full_name', 'email', 'subject', 'description']
        labels = {
            'full_name': '',
            'email': '',
            'subject': '',
            'description': '',
        }
        widgets = {
            'full_name' : forms.TextInput(attrs={'class': 'form-input', 'id': 'name', 'type': 'text', 'placeholder': 'نام و نام خانوادگی خود را وارد کنید', 'required': 'required',}),
            'email' : forms.TextInput(attrs={'class': 'form-input', 'id': 'email', 'type': 'email', 'placeholder': 'ایمیل خود را وارد کنید', 'required': 'required',}),
            'subject' : forms.TextInput(attrs={'class': 'form-input', 'id': 'subject', 'type': 'text', 'placeholder': 'موضوع پیام خود را وارد کنید', 'required': 'required',}),
            'description' : forms.Textarea(attrs={'class': 'form-textarea', 'id': 'message', 'type': 'text', 'placeholder': 'متن پیام خود را بنویسید...', 'required': 'required',}),
        }
