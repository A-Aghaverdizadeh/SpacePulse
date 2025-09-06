let currentPage = 1;
const perPage = 6;

const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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

async function fetchNeos(page = 1, perPage = 6) {
    const response = await fetch(`/neows?page=${page}&per_page=${perPage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken }
    });
    return await response.json();
}

function createNeoCard(neo) {
    const card = document.createElement("div");
    card.className = `neo-card ${neo.is_dangerous ? "hazardous" : "safe"}`;

    card.innerHTML = `
        <h3 class="neo-name">${neo.name}</h3>
        <div class="neo-info">
            <div class="info-item">
                <span class="info-label">فاصله از زمین:</span>
                <span class="info-value">${parseFloat(neo.miss_distance).toFixed(2)} km</span>
            </div>
            <div class="info-item">
                <span class="info-label">سرعت نسبی:</span>
                <span class="info-value">${parseFloat(neo.relative_speed).toFixed(2)} km/s</span>
            </div>
            <div class="info-item">
                <span class="info-label">قطر تخمینی:</span>
                <span class="info-value">${parseFloat(neo.diameter).toFixed(2)} m</span>
            </div>
            <div class="info-item">
                <span class="info-label">زمان نزدیک ترین موقعیت:</span>
                <span class="info-value">${neo.nearest_approach}</span>
            </div>
        </div>
        <div class="hazard-badge ${neo.is_dangerous ? "hazard-true" : "hazard-false"}">
            ${neo.is_dangerous ? "خطر برخورد احتمالی" : "ایمن"}
        </div>
    `;
    return card;
}

function renderPagination(totalPages, currentPage) {
    const pageNumbers = document.getElementById("page-numbers");
    pageNumbers.innerHTML = "";

    // چند تا شماره صفحه همزمان نمایش داده بشه
    const maxVisible = 5;  

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = i;
        if (i === currentPage) a.classList.add("active");
        
        a.addEventListener("click", (e) => {
            e.preventDefault();
            displayPage(i); // این تابع باید ریکوئست به سرور بزنه و دیتا رو بیاره
        });

        pageNumbers.appendChild(a);
    }

    // دکمه قبلی و بعدی
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    prevBtn.classList.toggle("disabled", currentPage === 1);
    nextBtn.classList.toggle("disabled", currentPage === totalPages);

    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) displayPage(currentPage - 1);
    };

    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) displayPage(currentPage + 1);
    };
}


async function displayPage(page = 1) {
    const grid = document.getElementById("neo-grid");
    grid.innerHTML = "";

    const data = await fetchNeos(page);
    totalPages = data.total_pages;
    currentPage = data.current_page;

    data.neos.forEach(neo => {
        const card = createNeoCard(neo);
        grid.appendChild(card);
    });

    setupMobileMenu();
    setupThemeToggle();
    renderPagination(data.total_pages, currentPage);
}

document.addEventListener('DOMContentLoaded', function() {
    createStars();

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

    displayPage(currentPage);

})
