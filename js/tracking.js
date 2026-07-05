function drawTemplate(character) {
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fontSize = 350;
    ctx.font = `bold ${fontSize}px "Comic Sans MS", Tajawal, sans-serif`;
    let textWidth = ctx.measureText(character).width;
    const maxAllowedWidth = canvas.width * 0.8;

    while (textWidth > maxAllowedWidth && fontSize > 50) {
        fontSize -= 10;
        ctx.font = `bold ${fontSize}px "Comic Sans MS", Tajawal, sans-serif`;
        textWidth = ctx.measureText(character).width;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E0E0E0';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#BDBDBD';
    ctx.strokeText(character, canvas.width / 2, canvas.height / 2);

    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // 🎨 هنا يتم تطبيق لون القلم الذي اختاره الطفل
    ctx.strokeStyle = window.currentPenColor || '#43A047';
}