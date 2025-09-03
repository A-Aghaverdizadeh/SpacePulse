const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
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
        const response = await fetch("", {
            method: "POST",
            headers: {'Content-Type': 'application/json', "X-CSRFToken": csrftoken,},
        })
        
        const data = await response.json();
        
        document.getElementById('apod-title').textContent = data.data.title_fa;
        document.getElementById('apod-date').textContent = formatAPODDate(data.data.date);
        
        const mediaContainer = document.getElementById('apod-media-container');
        mediaContainer.innerHTML = '';
        
        if (data.data.media_type === 'image') {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'apod-image-container';
            
            const image = document.createElement('img');
            image.src = data.data.url;
            image.alt = data.data.title_fa;
            image.className = 'apod-image';
            
            imageContainer.appendChild(image);
            mediaContainer.appendChild(imageContainer);
        } else if (data.data.media_type === 'video') {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'apod-video-container';
            
            const iframe = document.createElement('iframe');
            iframe.src = data.data.url;
            iframe.className = 'apod-video';
            iframe.allowFullscreen = true;
            
            videoContainer.appendChild(iframe);
            mediaContainer.appendChild(videoContainer);
        }
        
        document.getElementById('apod-explanation').textContent = data.data.explanation_fa;
        
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
    setInterval(updateAllData, 3000000);
});

// مدیریت فیلتر دسته‌بندی
document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.categories-list a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // حذف کلاس active از همه لینک‌ها
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // اضافه کردن کلاس active به لینک کلیک شده
            this.classList.add('active');
            
            // در اینجا می‌توانید کد فیلتر کردن مقالات بر اساس دسته‌بندی را اضافه کنید
            const category = this.textContent.split(' ')[0];
            alert(`فیلتر مقالات بر اساس دسته‌بندی: ${category}`);
        });
    });
    
    // مدیریت جستجو
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i');
    
    searchIcon.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`جستجو برای: ${searchTerm}`);
            // در اینجا می‌توانید کد جستجوی واقعی را اضافه کنید
        }
    }

    // مدیریت فرم خبرنامه
    const newsletterForm = document.querySelector('form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert(`ایمیل ${emailInput.value} با موفقیت ثبت شد!`);
                emailInput.value = '';
            }
        });
    }
    
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    applyFiltersBtn.addEventListener('click', function() {
        const date = document.getElementById('date').value;
        const hazardous = document.getElementById('hazardous').value;
        const distance = document.getElementById('distance').value;
        
        alert(`فیلترها اعمال شدند:\nتاریخ: ${date}\nخطر برخورد: ${hazardous}\nفاصله: ${distance}`);
        
        // در اینجا می‌توانید کد فیلتر کردن واقعی را اضافه کنید
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        document.getElementById('date').value = '2023-08-30';
        document.getElementById('hazardous').value = 'all';
        document.getElementById('distance').value = 'all';
        
        alert('فیلترها بازنشانی شدند.');
        
        // در اینجا می‌توانید کد بازنشانی فیلترها را اضافه کنید
    });
    
    // شبیه‌سازی داده‌های NeoWs
    const neos = document.querySelectorAll('.neo-card');
    
    neos.forEach(neo => {
        neo.addEventListener('click', function() {
            const name = this.querySelector('.neo-name').textContent;
            alert(`جزئیات بیشتر درباره ${name}\nاین بخش می‌تواند یک مودال یا صفحه جداگانه برای نمایش جزئیات باز کند.`);
        });
    });
});