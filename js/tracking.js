// دالة لرسم الحرف المفرغ كخلفية على اللوحة
function drawTemplate(character) {
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d');

    // تنظيف اللوحة بالكامل قبل رسم الحرف الجديد
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // إعدادات الخط (حجم كبير جداً يناسب الأطفال)
    ctx.font = 'bold 350px "Comic Sans MS", Tajawal, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // رسم الحرف بلون رمادي فاتح جداً (خلفية)
    ctx.fillStyle = '#E0E0E0';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);

    // رسم حدود الحرف لجعله يبدو مفرغاً وقابلاً للتلوين
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#BDBDBD';
    ctx.strokeText(character, canvas.width / 2, canvas.height / 2);

    // الأهم: إعادة إعدادات "قلم الطفل" الأصلية حتى لا يتأثر برسم القالب
    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#43A047'; // اللون الأخضر الزاهي لقلم الطفل
}