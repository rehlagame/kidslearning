let currentLevel = 0;
let stars = 0;
let lettersData = [];

// عناصر الشاشات
const homeScreen = document.getElementById('home-screen');
const drawingScreen = document.getElementById('drawing-screen');

// 1. برمجة أزرار الفئات (تشغيل الملف المناسب)
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetFile = button.getAttribute('data-target');
        loadCategoryData(targetFile);
    });
});

// 2. جلب بيانات الفئة المختارة
async function loadCategoryData(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        lettersData = await response.json();

        currentLevel = 0; // إعادة التصفير عند دخول قسم جديد
        switchScreen(homeScreen, drawingScreen); // الانتقال لشاشة الرسم

        // إصلاح مشكلة حجم الـ Canvas عند ظهور الشاشة المخفية
        window.dispatchEvent(new Event('resize'));

        startLevel();
    } catch (error) {
        console.error("خطأ في تحميل البيانات: ", error);
        alert("تأكد من تشغيل المشروع عبر سيرفر محلي (WebStorm) لقرائة ملفات JSON");
    }
}

// 3. التنقل بين الواجهات
function switchScreen(hideElement, showElement) {
    hideElement.classList.remove('active');
    hideElement.classList.add('hidden');
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

// 4. دالة بدء المستوى
function startLevel() {
    if (currentLevel >= lettersData.length) {
        alert("أنت بطل! لقد أنهيت جميع المراحل في هذا القسم 🎉");
        currentLevel = 0; // إعادة التكرار أو يمكن العودة للرئيسية
    }
    const currentData = lettersData[currentLevel];
    document.getElementById('level-title').innerText = currentData.name;
    drawTemplate(currentData.char);
}

// 5. التحكم بالأزرار (التالي، المسح، والعودة) والمؤثرات البصرية

// دالة إطلاق القصاصات الملونة
function fireConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC']
    });
}

document.getElementById('btn-next').addEventListener('click', () => {
    // إضافة نجمة وتحديث العداد
    stars += 1;
    document.getElementById('stars-count').innerText = stars;

    // إطلاق الاحتفال البصري
    fireConfetti();

    // الانتظار لمدة 800 جزء من الثانية قبل الانتقال للحرف التالي
    setTimeout(() => {
        currentLevel++;
        startLevel();
    }, 800);
});

document.getElementById('btn-clear').addEventListener('click', () => {
    if(lettersData.length > 0) drawTemplate(lettersData[currentLevel].char);
});

document.getElementById('btn-home').addEventListener('click', () => {
    switchScreen(drawingScreen, homeScreen); // العودة للقائمة
});

// تحديث الرسم عند دوران الشاشة
window.addEventListener('resize', () => {
    if(lettersData.length > 0 && drawingScreen.classList.contains('active')) {
        drawTemplate(lettersData[currentLevel].char);
    }
});

// 6. تسجيل Service Worker للعمل بدون إنترنت (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('تم تشغيل Service Worker بنجاح:', registration.scope);
            })
            .catch(error => {
                console.log('فشل تشغيل Service Worker:', error);
            });
    });
}