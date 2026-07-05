// 1. المتغيرات الأساسية ونظام حفظ النجوم والألوان
let currentLevel = 0;
let stars = parseInt(localStorage.getItem('kids_stars')) || 0;
let lettersData = [];
let currentMode = 'basic'; // الوضع الافتراضي للبرنامج (تأسيس أو متقدم)
window.currentPenColor = '#43A047'; // اللون الافتراضي للقلم (الأخضر لقلم الطفل)

// 2. تعريف عناصر الشاشات الأربع
const welcomeScreen = document.getElementById('welcome-screen');
const homeScreen = document.getElementById('home-screen');
const gridScreen = document.getElementById('grid-screen');
const drawingScreen = document.getElementById('drawing-screen');

// تحديث عداد النجوم في الشاشات
document.getElementById('total-stars-count').innerText = stars;
document.getElementById('map-stars-count').innerText = stars;

// 3. برمجة لوحة الألوان لتغيير لون القلم ديناميكياً 🎨
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // إزالة التفعيل من جميع أزرار الألوان
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active-color'));
        // إضافة التفعيل للزر الذي تم ضغطه حالياً
        e.target.classList.add('active-color');
        // تحديث متغير اللون العام المشترك مع محرك الرسم
        window.currentPenColor = e.target.getAttribute('data-color');

        // تطبيق اللون الجديد على لوحة الرسم فوراً إذا كانت مفتوحة
        const canvas = document.getElementById('drawing-board');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = window.currentPenColor;
        }
    });
});

// 4. برمجة أزرار البوابة الرئيسية (اختيار المستوى)
document.getElementById('btn-basic').addEventListener('click', () => {
    currentMode = 'basic';
    switchScreen(homeScreen);
});

document.getElementById('btn-advanced').addEventListener('click', () => {
    currentMode = 'advanced';
    switchScreen(homeScreen);
});

// 5. برمجة جزر خريطة الكنز (قراءة البيانات حسب المستوى المختار)
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // قراءة مسار الملف الصحيح بناءً على وضع البرنامج الحالي
        const targetFile = currentMode === 'basic'
            ? button.getAttribute('data-target-basic')
            : button.getAttribute('data-target-advanced');

        loadCategoryData(targetFile);
    });
});

// 6. جلب البيانات والانتقال لـ (شاشة الشبكة)
async function loadCategoryData(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        lettersData = await response.json();

        buildGrid();
        switchScreen(gridScreen);
    } catch (error) {
        console.error("خطأ في تحميل البيانات: ", error);
        alert("تأكد من تشغيل المشروع عبر سيرفر محلي لقراءة ملفات JSON");
    }
}

// 7. بناء شبكة الحروف/الكلمات ديناميكياً
function buildGrid() {
    const gridContainer = document.getElementById('items-grid');
    gridContainer.innerHTML = ''; // تنظيف الشبكة السابقة

    lettersData.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'grid-item';

        // تصغير الخط قليلاً إذا كان المربع يعرض كلمة طويلة بدلاً من حرف
        if (item.char.length > 3) {
            btn.style.fontSize = '1.8rem';
        }

        btn.innerText = item.char;

        // عند الضغط على أي عنصر، نفتح لوحة الرسم الخاصة به
        btn.addEventListener('click', () => {
            currentLevel = index;
            switchScreen(drawingScreen);
            window.dispatchEvent(new Event('resize'));
            startLevel();
        });

        gridContainer.appendChild(btn);
    });
}

// 8. التنقل الآمن بين الواجهات
function switchScreen(showElement) {
    // إخفاء جميع الشاشات أولاً
    welcomeScreen.classList.remove('active'); welcomeScreen.classList.add('hidden');
    homeScreen.classList.remove('active'); homeScreen.classList.add('hidden');
    gridScreen.classList.remove('active'); gridScreen.classList.add('hidden');
    drawingScreen.classList.remove('active'); drawingScreen.classList.add('hidden');

    // إظهار الشاشة المطلوبة فقط
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

// 9. دالة بدء الرسم
function startLevel() {
    const currentData = lettersData[currentLevel];
    document.getElementById('level-title').innerText = currentData.name;
    drawTemplate(currentData.char);
}

// 10. التحكم بأزرار لوحة الرسم والمؤثرات البصرية
function fireConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC']
    });
}

// زر الإنجاز
document.getElementById('btn-next').addEventListener('click', () => {
    // زيادة النجوم وحفظها
    stars += 1;
    localStorage.setItem('kids_stars', stars);
    document.getElementById('total-stars-count').innerText = stars;
    document.getElementById('map-stars-count').innerText = stars;

    // تمييز العنصر كـ "مُنجز"
    const gridItems = document.querySelectorAll('.grid-item');
    if(gridItems[currentLevel]) {
        gridItems[currentLevel].classList.add('completed');
    }

    fireConfetti();

    // العودة للشبكة بعد الاحتفال
    setTimeout(() => {
        switchScreen(gridScreen);
    }, 1500);
});

document.getElementById('btn-clear').addEventListener('click', () => {
    if(lettersData.length > 0) drawTemplate(lettersData[currentLevel].char);
});

// 11. أزرار الرجوع (Navigation)
document.getElementById('btn-back-grid').addEventListener('click', () => {
    switchScreen(gridScreen);
});

document.getElementById('btn-back-home').addEventListener('click', () => {
    switchScreen(homeScreen);
});

document.getElementById('btn-back-welcome').addEventListener('click', () => {
    switchScreen(welcomeScreen);
});

// 12. تحديث الرسم عند دوران الشاشة
window.addEventListener('resize', () => {
    if(lettersData.length > 0 && drawingScreen.classList.contains('active')) {
        drawTemplate(lettersData[currentLevel].char);
    }
});

// 13. تسجيل Service Worker للعمل بدون إنترنت
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(error => console.log('فشل تشغيل Service Worker:', error));
    });
}