// ایجاد ستاره های درخشان در پس زمینه
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

// تابع برای دریافت اطلاعات فضانوردان
async function fetchAstronauts() {
    try {
        const response = await fetch('http://api.open-notify.org/astros.json');
        const data = await response.json();
        document.getElementById('astronauts-count').textContent = data.number;
        return data;
    } catch (error) {
        console.error('Error fetching astronauts:', error);
        document.getElementById('astronauts-count').textContent = 'خطا در دریافت اطلاعات';
    }
}

// تابع برای دریافت موقعیت ایستگاه فضایی
async function fetchISSLocation() {
    try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        
        const latitude = parseFloat(data.iss_position.latitude).toFixed(4);
        const longitude = parseFloat(data.iss_position.longitude).toFixed(4);
        
        document.getElementById('iss-location').textContent = `${latitude}°, ${longitude}°`;
        document.getElementById('timestamp').textContent = data.timestamp;
        
        // تبدیل timestamp به زمان قابل خواندن
        const date = new Date(data.timestamp * 1000);
        document.getElementById('last-updated').textContent = date.toLocaleString('fa-IR');
        
        return data;
    } catch (error) {
        console.error('Error fetching ISS location:', error);
        document.getElementById('iss-location').textContent = 'خطا در دریافت اطلاعات';
        document.getElementById('timestamp').textContent = 'خطا در دریافت اطلاعات';
    }
}

// تابع برای دریافت تصویر روز ناسا
async function fetchAPOD() {
    try {
        // استفاده از API Key نمونه (در عمل باید از API Key خود استفاده کنید)
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();
        
        document.getElementById('apod-title').textContent = data.title;
        document.getElementById('apod-date').textContent = formatAPODDate(data.date);
        
        const mediaContainer = document.getElementById('apod-media-container');
        mediaContainer.innerHTML = '';
        
        if (data.media_type === 'image') {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'apod-image-container';
            
            const image = document.createElement('img');
            image.src = data.url;
            image.alt = data.title;
            image.className = 'apod-image';
            
            imageContainer.appendChild(image);
            mediaContainer.appendChild(imageContainer);
        } else if (data.media_type === 'video') {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'apod-video-container';
            
            const iframe = document.createElement('iframe');
            iframe.src = data.url;
            iframe.className = 'apod-video';
            iframe.allowFullscreen = true;
            
            videoContainer.appendChild(iframe);
            mediaContainer.appendChild(videoContainer);
        }
        
        document.getElementById('apod-explanation').textContent = data.explanation;
        
    } catch (error) {
        console.error('Error fetching APOD:', error);
        const mediaContainer = document.getElementById('apod-media-container');
        mediaContainer.innerHTML = `
            <div class="apod-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>خطا در دریافت تصویر روز ناسا. لطفاً دوباره تلاش کنید.</p>
            </div>
        `;
        document.getElementById('apod-explanation').textContent = '';
    }
}

// تابع برای فرمت تاریخ APOD
function formatAPODDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// تابع برای به روزرسانی همه اطلاعات
async function updateAllData() {
    // نمایش وضعیت در حال بارگذاری
    document.querySelectorAll('.card-content').forEach(el => {
        el.innerHTML = '<div class="loading">در حال دریافت...</div>';
    });
    
    // دریافت اطلاعات
    await Promise.all([fetchAstronauts(), fetchISSLocation(), fetchAPOD()]);
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
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        themeToggle.classList.toggle('active');
        
        // ذخیره حالت انتخاب شده در localStorage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
}

// مقداردهی اولیه هنگام لود صفحه
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    updateAllData();
    setupMobileMenu();
    setupThemeToggle();
    
    // اضافه کردن event listener برای دکمه به روزرسانی
    document.getElementById('refresh-btn').addEventListener('click', updateAllData);
    
    // به روزرسانی خودکار هر 30 ثانیه
    setInterval(updateAllData, 30000);
});