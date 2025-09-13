# پالس فضا | اطلاعات فضا برای علاقه مندان به فضا

🔗 [یه سر به سایت بزن](https://spacepulse.ir)

SpacePulse یک وب‌اپلیکیشن ساخته شده با Django است که اطلاعات فضایی و نجومی را از API رسمی ناسا (NASA Open APIs) دریافت کرده و به کاربران نمایش می‌دهد. هدف این پروژه ارائه محتوای علمی و به‌روز درباره فضا و نجوم به صورت ساده و کاربرپسند است.

## 🚀 Features

- ✅ نمایش تعداد فضانوردان در فضا
- ✅ نمایش موقعیت ایستگاه فضایی
- ✅ نمایش عکس روز ناسا همراه با توضیحات
- ✅ نمایش اجرام نزدیک به زمین و سطح خطر آنها

## 🛠️ راهنمای نصب

### 1. پروژه رو کلون کن و برو تو پوشه

```bash
git clone https://github.com/A-Aghaverdizadeh/SpacePulse.git
cd SpacePulse
```

### 2. یک محیط مجازی بساز و فعالش کن
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

### 3. پیش نیاز های پایتون رو نصب کن
```bash
pip install -r requirements.txt
```

### 5. اجرای مایگریشن ها
```bash
python manage.py migrate
```

### 6. دریافت عکس روز ناسا
```bash
python manage.py fetch_apod
```

### 7. دریافت اطلاعات اجرام نزدیک به زمین
```bash
python manage.py fetch_neows
```

### 8. ایجاد سوپریوزر
```bash
python manage.py createsuperuser
```

### 9. اجرای سرور
```bash
python manage.py runserver
```
