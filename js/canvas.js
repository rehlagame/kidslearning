// تحديد العناصر من واجهة المستخدم
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.canvas-container');
// تم حذف تعريف زر btnClear من هنا لأنه مبرمج في ملف app.js

// 1. ضبط أبعاد لوحة الرسم لتملأ الحاوية بالكامل
function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // إعادة ضبط خصائص القلم بعد كل تغيير لحجم الشاشة
    ctx.lineWidth = 25;           // خط عريض يناسب الأطفال
    ctx.lineCap = 'round';        // نهايات دائرية ناعمة للخط
    ctx.lineJoin = 'round';       // زوايا دائرية عند انحناء الخط
    ctx.strokeStyle = '#43A047';  // لون أخضر زاهي ومبهج
}

// استدعاء الدالة عند البداية، وعند تدوير شاشة الآيباد
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 2. متغيرات حالة الرسم
let isDrawing = false;

// 3. دوال الرسم الأساسية
function startPosition(e) {
    isDrawing = true;
    draw(e); // لرسم نقطة بمجرد اللمس دون تحريك
}

function endPosition() {
    isDrawing = false;
    ctx.beginPath(); // قطع المسار حتى لا يتصل الحرف القديم بالجديد
}

function draw(e) {
    if (!isDrawing) return;

    // منع السلوك الافتراضي للمتصفح (مثل التمرير) أثناء الرسم
    e.preventDefault();

    // حساب إحداثيات القلم أو الإصبع بدقة داخل اللوحة
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // رسم الخط
    ctx.lineTo(x, y);
    ctx.stroke();

    // تحديث نقطة البداية لتنعيم حركة الخط
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 4. ربط الأحداث (Pointer Events تدعم اللمس، القلم، والفأرة معاً)
canvas.addEventListener('pointerdown', startPosition);
canvas.addEventListener('pointerup', endPosition);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointercancel', endPosition); // في حال خروج القلم عن الشاشة