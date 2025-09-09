const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// مدیریت تغییر تم
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starsCount = 150;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // اندازه تصادفی برای ستاره
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // موقعیت تصادفی برای ستاره
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // مدت زمان تصادفی برای انیمیشن
        star.style.animationDuration = `${2 + Math.random() * 5}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}

// مدیریت منوی همبرگری
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // بستن منو با کلیک روی لینک‌ها
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// مدیریت تغییر تم
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // بررسی وضعیت ذخیره شده در localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.classList.add('active');
        updateMapTheme('light');
    } else {
        updateMapTheme('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        themeToggle.classList.toggle('active');
        
        // به روزرسانی تم نقشه
        if (body.classList.contains('light-mode')) {
            updateMapTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            updateMapTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// مدیریت نقشه
let map;
let marker;

function initMap() {
    // مختصات دفتر رصدخانه فضایی (مثال: تهران، میرداماد)
    const officeLocation = [38.398511344498544, 47.67790339987418];
    
    // ایجاد نقشه
    map = L.map('map').setView(officeLocation, 15);
    
    // اضافه کردن لایه نقشه پایه (با توجه به حالت شب/روز)
    if (document.body.classList.contains('light-mode')) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        
        // اضافه کردن کلاس برای فیلترهای تاریک
        document.getElementById('map').classList.add('dark-map');
    }
    
    // اضافه کردن نشانگر
    marker = L.marker(officeLocation).addTo(map);
    marker.bindPopup("<b>دفتر روبودو</b><br>مشگین شهر، آیت الله مشگینی").openPopup();
    
    // اضافه کردن کنترل‌های zoom
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
}

// به روزرسانی تم نقشه
function updateMapTheme(theme) {
    if (!map) return;
    
    // حذف تمام لایه‌های نقشه فعلی
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });
    
    // حذف نشانگر
    if (marker) {
        map.removeLayer(marker);
    }
    
    // اضافه کردن لایه نقشه جدید بر اساس تم
    if (theme === 'light') {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // حذف کلاس فیلتر تاریک
        document.getElementById('map').classList.remove('dark-map');
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        
        // اضافه کردن کلاس برای فیلترهای تاریک
        document.getElementById('map').classList.add('dark-map');
    }
    
    // اضافه کردن مجدد نشانگر
    const officeLocation = [35.7448, 51.3753];
    marker = L.marker(officeLocation).addTo(map);
    marker.bindPopup("<b>دفتر روبودو</b><br>مشگین شهر، آیت الله مشگینی");
}

function showNotification(type, title, message, duration = 5000) {
    const notificationContainer = document.getElementById('notification-container');

    // ایجاد عنصر نوتیفیکیشن
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // آیکون بر اساس نوع نوتیفیکیشن
    let iconClass;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        case 'info':
            iconClass = 'fas fa-info-circle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }

    // محتوای نوتیفیکیشن
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // اضافه کردن نوتیفیکیشن به صفحه
    notificationContainer.appendChild(notification);

    // نمایش انیمیشن
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // بستن نوتیفیکیشن با کلیک روی دکمه بستن
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });

    // بستن خودکار نوتیفیکیشن پس از مدت زمان مشخص
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }

    return notification;
    }

    function closeNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}



// مدیریت فرم تماس
function setupContactForm() {
    const contactForm = document.querySelector("#contact-form");
    const submitButton = document.getElementById('submit-button');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    contactForm.addEventListener('submit',async function(e) {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitText.style.opacity = '0.5';
        loadingSpinner.style.display = 'block';

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch("/contact-us", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": csrftoken,
                },
            });

            const data = await response.json();


            if (response.ok) {
                showNotification(
                    'success', 
                    data.message, 
                    'ما در اسرع وقت با شما تماس خواهیم گرفت.', 
                    5000
                );
                contactForm.reset();
            } else {
                alert(data.message);
                showNotification(
                    'error', 
                    data.message, 
                    'خطا', 
                    5000
                );
            }
        } catch (error) {
            alert("خطا در ارسال فرم!");
            console.error(error);
        } finally {
            submitButton.disabled = false;
            submitText.style.opacity = '1';
            loadingSpinner.style.display = 'none';
        }
    });
}

// مدیریت سوالات متداول
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // بستن سایر سوالات
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer) {
                    item.style.display = 'none';
                    item.previousElementSibling.querySelector('i').classList.remove('fa-chevron-up');
                    item.previousElementSibling.querySelector('i').classList.add('fa-chevron-down');
                }
            });
            
            // باز یا بسته کردن سوال جاری
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                answer.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    setupMobileMenu();
    setupThemeToggle();
    initMap();
    setupContactForm();
    setupFAQ();
});