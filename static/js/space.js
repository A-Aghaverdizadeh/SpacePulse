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

// تابع برای به روزرسانی همه اطلاعات
async function updateAllData() {
    // نمایش وضعیت در حال بارگذاری
    document.querySelectorAll('.card-content').forEach(el => {
        el.innerHTML = '<div class="loading">در حال دریافت...</div>';
    });
    
    // دریافت اطلاعات
    await Promise.all([fetchAstronauts(), fetchISSLocation()]);
}

// مقداردهی اولیه هنگام لود صفحه
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    updateAllData();
    
    // اضافه کردن event listener برای دکمه به روزرسانی
    document.getElementById('refresh-btn').addEventListener('click', updateAllData);
    
    // به روزرسانی خودکار هر 30 ثانیه
    setInterval(updateAllData, 30000);
});