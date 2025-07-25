// 結果頁面的主要腳本

// 在文檔加載完成後執行
document.addEventListener('DOMContentLoaded', () => {
    // 檢查測試資料完整性
    if (!checkTestDataIntegrity()) {
        alert('測試資料不完整，請重新進行測試。');
        window.location.href = 'index.html';
        return;
    }

    // 顯示用戶資訊
    displayUserInfo();
    
    // 計算並顯示DISC分數
    calculateAndDisplayScores();
    
    // 繪製雷達圖
    renderRadarChart();
    
    // 設置按鈕事件
    setupButtonEvents();
    
    // 添加窗口大小變化時重新繪製雷達圖
    window.addEventListener('resize', debounce(renderRadarChart, 250));
    
    // 添加方向變化事件監聽器（處理手機旋轉）
    window.addEventListener('orientationchange', () => {
        setTimeout(renderRadarChart, 300);
    });
});

// 防抖函數，避免頻繁觸發重繪
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 檢查測試資料完整性
function checkTestDataIntegrity() {
    const userName = getFromLocalStorage('discUserName');
    const answers = getFromLocalStorage('discAnswers');
    
    if (!userName || !answers || !Array.isArray(answers)) {
        return false;
    }
    
    // 檢查答案是否完整（全部20題都已回答）
    return answers.length === 20 && !answers.includes(null);
}

// 顯示用戶資訊
function displayUserInfo() {
    const userName = getFromLocalStorage('discUserName');
    const testDate = new Date();
    
    document.getElementById('user-name').textContent = userName;
    document.getElementById('test-date').textContent = formatDate(testDate);
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 計算並顯示DISC分數
function calculateAndDisplayScores() {
    // 獲取答案
    const answers = getFromLocalStorage('discAnswers');
    if (!answers) {
        console.error('無法獲取答案數據');
        return;
    }
    
    // 初始化計數器
    const external = {
        D: 0,
        I: 0,
        S: 0,
        C: 0
    };
    
    const internal = {
        D: 0,
        I: 0,
        S: 0,
        C: 0
    };
    
    // 計算分數 (題目1-10為外在行為，11-20為內在動機)
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        if (answer !== null) {
            if (i < 10) {
                // 外在行為
                switch (answer) {
                    case 0: external.D++; break;
                    case 1: external.I++; break;
                    case 2: external.S++; break;
                    case 3: external.C++; break;
                }
            } else {
                // 內在動機
                switch (answer) {
                    case 0: internal.D++; break;
                    case 1: internal.I++; break;
                    case 2: internal.S++; break;
                    case 3: internal.C++; break;
                }
            }
        }
    }
    
    // 計算總和分數
    const total = {
        D: external.D + internal.D,
        I: external.I + internal.I,
        S: external.S + internal.S,
        C: external.C + internal.C
    };
    
    // 顯示分數
    // 外在行為
    document.getElementById('ext-d').textContent = external.D;
    document.getElementById('ext-i').textContent = external.I;
    document.getElementById('ext-s').textContent = external.S;
    document.getElementById('ext-c').textContent = external.C;
    
    // 內在動機
    document.getElementById('int-d').textContent = internal.D;
    document.getElementById('int-i').textContent = internal.I;
    document.getElementById('int-s').textContent = internal.S;
    document.getElementById('int-c').textContent = internal.C;
    
    // 合計分數
    document.getElementById('total-d').textContent = total.D;
    document.getElementById('total-i').textContent = total.I;
    document.getElementById('total-s').textContent = total.S;
    document.getElementById('total-c').textContent = total.C;
    
    // 計算組合分數（用於點位計算）
    const externalCombinations = calculateCombinationScores(external);
    const internalCombinations = calculateCombinationScores(internal);
    
    // 計算總合組合分數
    const totalCombinations = {
        di: externalCombinations.di + internalCombinations.di,
        is: externalCombinations.is + internalCombinations.is,
        sc: externalCombinations.sc + internalCombinations.sc,
        cd: externalCombinations.cd + internalCombinations.cd
    };
    
    // 計算點位
    const externalPoints = calculatePoints(externalCombinations);
    const internalPoints = calculatePoints(internalCombinations);
    const totalPoints = calculatePoints(totalCombinations);
    
    // 顯示點位
    document.getElementById('external-x').textContent = externalPoints.x;
    document.getElementById('external-y').textContent = externalPoints.y;
    document.getElementById('internal-x').textContent = internalPoints.x;
    document.getElementById('internal-y').textContent = internalPoints.y;
    document.getElementById('total-x').textContent = totalPoints.x;
    document.getElementById('total-y').textContent = totalPoints.y;
    
    // 保存分數到 LocalStorage
    saveToLocalStorage('discExternal', external);
    saveToLocalStorage('discInternal', internal);
    saveToLocalStorage('discTotal', total);
    saveToLocalStorage('discExternalCombinations', externalCombinations);
    saveToLocalStorage('discInternalCombinations', internalCombinations);
    saveToLocalStorage('discTotalCombinations', totalCombinations);
    saveToLocalStorage('discExternalPoints', externalPoints);
    saveToLocalStorage('discInternalPoints', internalPoints);
    saveToLocalStorage('discTotalPoints', totalPoints);
    
    // 渲染雷達圖
    renderRadarChart();
    
    return {
        external,
        internal,
        total,
        externalCombinations,
        internalCombinations,
        totalCombinations,
        externalPoints,
        internalPoints,
        totalPoints
    };
}

// 計算組合分數
function calculateCombinationScores(scores) {
    return {
        di: scores.D + scores.I,
        is: scores.I + scores.S,
        sc: scores.S + scores.C,
        cd: scores.C + scores.D
    };
}

// 計算點位
function calculatePoints(combinations) {
    // 原來的計算：X=(D+I)-(S+C)，Y=(I+S)-(C+D)
    const originalX = combinations.di - combinations.sc;
    const originalY = combinations.is - combinations.cd;
    
    // 交換X和Y的定義，讓數字A變成Y，數字B變成X
    return {
        x: originalY,  // 新的X是原來的Y
        y: originalX   // 新的Y是原來的X
    };
}

// 繪製雷達圖
function renderRadarChart() {
    // 獲取保存的數據
    const external = getFromLocalStorage('discExternal');
    const internal = getFromLocalStorage('discInternal');
    const total = getFromLocalStorage('discTotal');
    const points = {
        external: getFromLocalStorage('discExternalPoints'),
        internal: getFromLocalStorage('discInternalPoints'),
        total: getFromLocalStorage('discTotalPoints')
    };
    
    if (!external || !internal || !total || !points.external || !points.internal || !points.total) {
        console.error('無法獲取雷達圖所需數據');
        return;
    }
    
    // 獲取Canvas元素
    const canvas = document.getElementById('radar-chart');
    if (!canvas) {
        console.error('無法獲取Canvas元素');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 設置Canvas尺寸 - 根據容器大小自適應
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // 設置合適的尺寸，確保在手機上也能正常顯示
    let canvasSize;
    
    // 在小屏幕上進一步調整尺寸
    if (window.innerWidth <= 768) {
        canvasSize = Math.min(containerWidth, 300);
        // 確保Canvas足夠大以容納所有元素
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.width = canvasSize;
        canvas.height = canvasSize;
    } else {
        canvasSize = Math.min(containerWidth, 420);
        canvas.width = canvasSize;
        canvas.height = canvasSize;
    }
    
    // 繪製雷達圖
    drawRadarChart(ctx, external, internal, total, points);
}

// 繪製雷達圖
function drawRadarChart(ctx, external, internal, total, points) {
    // 獲取Canvas尺寸
    const canvas = ctx.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // 計算中心點和半徑
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // 在手機版上使用較小的半徑，確保圖表完全顯示
    let maxRadius;
    if (window.innerWidth <= 768) {
        maxRadius = Math.min(canvasWidth, canvasHeight) * 0.32; // 手機版使用較小的半徑
    } else {
        maxRadius = Math.min(canvasWidth, canvasHeight) * 0.35; // 桌面版使用原來的半徑
    }
    
    // 清除Canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 繪製背景網格
    drawRadarGrid(ctx, centerX, centerY, maxRadius);
    
    // 繪製量尺
    drawScale(ctx, centerX, centerY, maxRadius);
    
    // 繪製DISC數據
    drawRadarData(ctx, centerX, centerY, maxRadius, external, 'rgba(65, 105, 225, 0.7)', 'rgba(65, 105, 225, 1)');
    drawRadarData(ctx, centerX, centerY, maxRadius, internal, 'rgba(220, 20, 60, 0.7)', 'rgba(220, 20, 60, 1)');
    
    // 繪製點位
    drawPoints(ctx, centerX, centerY, maxRadius, points);
}

// 繪製雷達圖背景網格
function drawRadarGrid(ctx, centerX, centerY, maxRadius) {
    // 繪製同心圓
    const gridCount = 10; // 改為10，每個同心圓代表1
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= gridCount; i++) {
        const radius = maxRadius * (i / gridCount);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 每隔2個刻度加粗網格線
        if (i % 2 === 0 && i < gridCount) {
            ctx.save();
            ctx.strokeStyle = '#d0d0d0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    // 繪製軸線
    const axisCount = 12; // 12等分
    ctx.save();
    
    // 先繪製輔助分割線（較細的灰色線）
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < axisCount; i++) {
        const angle = (Math.PI * 2 * i) / axisCount - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // 再繪製主要的4條DISC軸線（較粗的深色線）
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const mainAxes = [0, 3, 6, 9]; // 對應 0°, 90°, 180°, 270° (調整為對應D+I, I+S, S+C, C+D的位置)
    mainAxes.forEach(i => {
        const angle = (Math.PI * 2 * i) / axisCount - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    ctx.restore();
}

// 繪製量尺
function drawScale(ctx, centerX, centerY, maxRadius) {
    // 根據畫布大小調整字體大小
    const fontSize = Math.max(9, Math.min(11, maxRadius / 15));
    const labelFontSize = Math.max(12, Math.min(14, maxRadius / 12));
    const labelOffset = Math.max(15, maxRadius / 10);
    
    ctx.fillStyle = '#555';
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 2; i <= 10; i += 2) {  // 只標記偶數
        const radius = maxRadius * (i / 10);
        // 在上方標記數字
        ctx.fillText(i.toString(), centerX, centerY - radius - 5);
    }
    
    // 繪製軸標籤 - 主要的4個DISC軸線
    ctx.font = `bold ${labelFontSize}px Arial`;
    
    // 計算主要軸線的角度（保持原來的4個方向）
    const mainAxes = [
        { label: 'D+I', angle: -Math.PI / 2 },      // 上方
        { label: 'I+S', angle: 0 },                 // 右方  
        { label: 'S+C', angle: Math.PI / 2 },       // 下方
        { label: 'C+D', angle: Math.PI }            // 左方
    ];
    
    mainAxes.forEach(axis => {
        const x = centerX + (maxRadius + labelOffset) * Math.cos(axis.angle);
        const y = centerY + (maxRadius + labelOffset) * Math.sin(axis.angle);
        ctx.fillText(axis.label, x, y);
    });
}

// 繪製雷達圖數據
function drawRadarData(ctx, centerX, centerY, maxRadius, data, fillColor, strokeColor) {
    // 計算組合值
    const diValue = data.D + data.I;
    const isValue = data.I + data.S;
    const scValue = data.S + data.C;
    const cdValue = data.C + data.D;
    
    // 找到最大值來進行比例縮放（每個刻度代表1）
    const maxValue = 10; // 固定最大值為10
    
    const values = [
        diValue / maxValue,  // DI
        isValue / maxValue,  // IS 
        scValue / maxValue,  // SC
        cdValue / maxValue   // CD
    ];
    
    // 繪製填充多邊形
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(1.5, Math.min(2.5, maxRadius / 60)); // 根據畫布大小調整線寬
    
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        const ratio = Math.min(values[i], 1); // 確保不超出圖表
        const radius = maxRadius * ratio;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.globalAlpha = 0.4; // 設置透明度
    ctx.fill();
    ctx.globalAlpha = 1.0; // 恢復透明度
    ctx.stroke();
    
    // 繪製數值標籤
    // 根據畫布大小調整字體大小
    const fontSize = Math.max(10, Math.min(12, maxRadius / 15));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        const ratio = Math.min(values[i], 1);
        const radius = maxRadius * ratio;
        
        // 選擇要顯示的值
        let valueToShow;
        if (i === 0) valueToShow = diValue;
        else if (i === 1) valueToShow = isValue;
        else if (i === 2) valueToShow = scValue;
        else valueToShow = cdValue;
        
        // 數值文字顯示位置
        const textRadius = radius + Math.max(10, maxRadius / 15);
        const textX = centerX + textRadius * Math.cos(angle);
        const textY = centerY + textRadius * Math.sin(angle);
        
        // 文字背景
        const textWidth = ctx.measureText(valueToShow.toString()).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(textX - textWidth/2 - 3, textY - 8, textWidth + 6, 16);
        
        // 文字
        ctx.fillStyle = strokeColor;
        ctx.fillText(valueToShow.toString(), textX, textY);
    }
}

// 繪製點位
function drawPoints(ctx, centerX, centerY, maxRadius, points) {
    // 將點位轉換為坐標
    const externalPoint = pointToCoordinates(points.external.x, points.external.y, centerX, centerY, maxRadius);
    const internalPoint = pointToCoordinates(points.internal.x, points.internal.y, centerX, centerY, maxRadius);
    const totalPoint = pointToCoordinates(points.total.x, points.total.y, centerX, centerY, maxRadius);
    
    // 繪製X和Y軸
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    
    // X軸
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.stroke();
    
    // Y軸
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.stroke();
    
    ctx.restore(); // 恢復之前的繪圖狀態
    
    // 根據畫布大小調整點位大小
    const pointRadius = Math.max(6, Math.min(8, maxRadius / 20));
    const fontSize = Math.max(10, Math.min(12, maxRadius / 15));
    
    // 繪製外顯點位（藍色）
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgba(65, 105, 225, 1)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(externalPoint.x, externalPoint.y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 繪製內在點位（紅色）
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgba(220, 20, 60, 1)';
    
    ctx.beginPath();
    ctx.arc(internalPoint.x, internalPoint.y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 繪製合計點位（灰色）
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgba(80, 80, 80, 1)';
    
    ctx.beginPath();
    ctx.arc(totalPoint.x, totalPoint.y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 添加點位標記
    ctx.font = `bold ${fontSize}px Arial`;
    
    // 外顯點標記
    ctx.fillStyle = 'rgba(65, 105, 225, 1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', externalPoint.x, externalPoint.y);
    
    // 內顯點標記
    ctx.fillStyle = 'rgba(220, 20, 60, 1)';
    ctx.fillText('I', internalPoint.x, internalPoint.y);
    
    // 合計點標記
    ctx.fillStyle = 'rgba(80, 80, 80, 1)';
    ctx.fillText('T', totalPoint.x, totalPoint.y);
}

// 將點位轉換為坐標
function pointToCoordinates(x, y, centerX, centerY, maxRadius) {
    // 點位轉換為笛卡爾坐標
    // 將x和y限制在一個合理範圍內
    const scale = 20; // 增加縮放因子，使點位在雷達圖內更合理顯示
    
    // 確保點位在合理範圍內，避免超出雷達圖
    let normalizedX = Math.min(Math.max(x, -scale), scale) / scale; // 限制在-1到1之間
    let normalizedY = Math.min(Math.max(y, -scale), scale) / scale; // 限制在-1到1之間
    
    // 計算點位到原點的距離，確保不會超出雷達圖
    const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
    if (distance > 1) {
        normalizedX = normalizedX / distance * 0.9; // 縮小到雷達圖內90%範圍
        normalizedY = normalizedY / distance * 0.9; // 縮小到雷達圖內90%範圍
    }
    
    // 計算對應座標
    return {
        x: centerX + normalizedX * maxRadius,
        y: centerY - normalizedY * maxRadius // 注意Y軸方向相反
    };
}

// 設置按鈕事件
function setupButtonEvents() {
    // 報告分析按鈕
    document.getElementById('analysis-btn').addEventListener('click', () => {
        window.open('https://lin.ee/RaehHxl', '_blank');
    });
    
    // 下載報告按鈕
    document.getElementById('download-btn').addEventListener('click', () => {
        generatePDF();
    });
    
    // 重新測試按鈕
    document.getElementById('retest-btn').addEventListener('click', () => {
        if (confirm('確定要重新進行測試嗎？這將清除您的當前結果。')) {
            clearLocalStorageData();
            window.location.href = 'index.html';
        }
    });
}

// 優化雷達圖以便在PDF中顯示
function optimizeRadarChartForPDF() {
    // 重新渲染雷達圖，使用稍小的尺寸以便適應一頁
    const canvas = document.getElementById('radar-chart');
    if (canvas) {
        // 保存當前尺寸
        const currentWidth = canvas.width;
        const currentHeight = canvas.height;
        
        // 設置更適合一頁PDF的尺寸
        canvas.width = 380;
        canvas.height = 380;
        
        // 重繪雷達圖
        renderRadarChart();
        
        return { currentWidth, currentHeight };
    }
    return null;
}

// 恢復雷達圖原始尺寸
function restoreRadarChart(originalDimensions) {
    if (originalDimensions) {
        const canvas = document.getElementById('radar-chart');
        if (canvas) {
            canvas.width = originalDimensions.currentWidth;
            canvas.height = originalDimensions.currentHeight;
            renderRadarChart();
        }
    }
}

// 生成PDF
function generatePDF() {
    // 顯示加載指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'pdf-loading';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>正在生成PDF，請稍候...</p>';
    loadingIndicator.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.8); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999;';
    
    const spinner = loadingIndicator.querySelector('.spinner');
    spinner.style.cssText = 'width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid #4a6fa5; border-radius:50%; animation:spin 1s linear infinite;';
    
    // 添加旋轉動畫
    const style = document.createElement('style');
    style.innerHTML = '@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}';
    document.head.appendChild(style);
    
    document.body.appendChild(loadingIndicator);
    
    try {
        // 預先準備雷達圖，確保它是最新的，且大小合適
        prepareRadarChart();
        
        // 給雷達圖足夠時間渲染
        setTimeout(() => {
            try {
                // 創建PDF容器
                const pdfContainer = createPDFContainer();
                
                // 將容器添加到DOM中
                document.body.appendChild(pdfContainer);
                
                // 使用html2canvas捕獲PDF容器
                html2canvas(pdfContainer, {
                    scale: 2, // 提高清晰度
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    try {
                        // 移除臨時PDF容器
                        document.body.removeChild(pdfContainer);
                        
                        // 創建PDF文檔
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        
                        // 設置PDF頁面尺寸和邊距
                        const pageWidth = 210; // A4寬度 (mm)
                        const pageHeight = 297; // A4高度 (mm)
                        const margin = 10; // 減小邊距 (mm)，從15改為10
                        const contentWidth = pageWidth - (margin * 2);
                        
                        // 計算圖像尺寸，確保寬度適合頁面
                        const imgWidth = contentWidth;
                        // 調整高度計算，確保內容不會被截斷
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // 檢查是否需要縮放以適應頁面高度
                        const maxHeight = pageHeight - (margin * 2);
                        let finalImgWidth = imgWidth;
                        let finalImgHeight = imgHeight;
                        
                        // 如果內容高度超過頁面高度，進行縮放
                        if (imgHeight > maxHeight) {
                            const scale = maxHeight / imgHeight;
                            finalImgWidth = imgWidth * scale;
                            finalImgHeight = maxHeight;
                        }
                        
                        // 添加圖像到PDF，調整位置使其居中
                        const xOffset = (pageWidth - finalImgWidth) / 2;
                        pdf.addImage(
                            canvas.toDataURL('image/jpeg', 1.0),
                            'JPEG',
                            xOffset,
                            margin,
                            finalImgWidth,
                            finalImgHeight
                        );
                        
                        // 保存PDF
                        const userName = getFromLocalStorage('discUserName') || 'User';
                        pdf.save(`DISC_測試報告_${userName}.pdf`);
                        
                        // 移除加載指示器
                        document.body.removeChild(loadingIndicator);
                        
                        // 恢復原始雷達圖尺寸
                        restoreRadarChart();
                    } catch (error) {
                        console.error('PDF生成過程中發生錯誤:', error);
                        handlePDFError(loadingIndicator);
                    }
                }).catch(error => {
                    console.error('HTML轉Canvas過程中發生錯誤:', error);
                    handlePDFError(loadingIndicator);
                });
            } catch (error) {
                console.error('準備PDF容器時發生錯誤:', error);
                handlePDFError(loadingIndicator);
            }
        }, 500); // 給雷達圖0.5秒時間渲染
    } catch (error) {
        console.error('PDF生成初始化時發生錯誤:', error);
        handlePDFError(loadingIndicator);
    }
    
    // 處理PDF生成錯誤
    function handlePDFError(loadingIndicator) {
        alert('生成PDF時發生錯誤，請稍後再試。');
        document.body.removeChild(loadingIndicator);
        restoreRadarChart();
    }
    
    // 準備雷達圖用於PDF生成
    function prepareRadarChart() {
        const radarChart = document.getElementById('radar-chart');
        if (!radarChart) return;
        
        // 保存原始尺寸
        radarChart._originalWidth = radarChart.width;
        radarChart._originalHeight = radarChart.height;
        
        // 調整為適合PDF的尺寸
        radarChart.width = 380;
        radarChart.height = 380;
        
        // 重新渲染雷達圖
        renderRadarChart();
    }
    
    // 恢復雷達圖的原始尺寸
    function restoreRadarChart() {
        const radarChart = document.getElementById('radar-chart');
        if (!radarChart) return;
        
        if (radarChart._originalWidth && radarChart._originalHeight) {
            radarChart.width = radarChart._originalWidth;
            radarChart.height = radarChart._originalHeight;
            renderRadarChart();
        }
    }
    
    // 創建PDF容器並填充內容
    function createPDFContainer() {
        // 創建用於PDF的容器
        const container = document.createElement('div');
        container.id = 'pdf-container';
        container.style.cssText = 'position:absolute; left:-9999px; width:750px; background-color:white; padding:20px; font-family:Arial, sans-serif;';
        
        // 創建標題
        const title = document.createElement('h1');
        title.innerHTML = 'DISC 人格測驗 - 結果報告';
        title.style.cssText = 'text-align:center; color:#4a6fa5; font-size:22px; margin-bottom:15px;';
        container.appendChild(title);
        
        // 創建用户信息區
        const userInfo = document.querySelector('.user-info').cloneNode(true);
        userInfo.style.cssText = 'margin:10px 0 20px; padding:10px; background-color:#f9f9f9; border-radius:5px; display:flex; justify-content:space-around;';
        container.appendChild(userInfo);
        
        // 創建表格區域
        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'margin-bottom:15px;';
        
        // 獲取原始表格並克隆
        const originalTable = document.querySelector('.disc-score-table');
        const tableClone = originalTable.cloneNode(true);
        tableClone.style.cssText = 'width:100%; border-collapse:collapse; margin:0 auto; font-size:12px;';
        
        // 確保表格樣式正確
        const categoryTDs = tableClone.querySelectorAll('.category-cell');
        categoryTDs.forEach(td => {
            td.style.cssText = 'background-color:#e6f0ff; font-weight:bold; padding:8px 12px; text-align:center; border-right:2px solid #ccc;';
        });
        
        // 修正表格單元格樣式
        const allTDs = tableClone.querySelectorAll('td:not(.category-cell)');
        allTDs.forEach(td => {
            td.style.cssText = 'padding:6px 8px; border:1px solid #ccc; text-align:center;';
        });
        
        // 處理外在行為區塊
        const externalRows = tableClone.querySelectorAll('.external-section');
        externalRows.forEach(row => {
            row.querySelectorAll('td:not(.category-cell)').forEach(td => {
                td.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
            });
        });
        
        // 處理內在動機區塊
        const internalRows = tableClone.querySelectorAll('.internal-section');
        internalRows.forEach(row => {
            row.querySelectorAll('td:not(.category-cell)').forEach(td => {
                td.style.backgroundColor = 'rgba(230, 57, 70, 0.1)';
            });
        });
        
        // 處理合計區塊
        const totalRows = tableClone.querySelectorAll('.total-section');
        totalRows.forEach(row => {
            row.querySelectorAll('td:not(.category-cell)').forEach(td => {
                td.style.backgroundColor = 'rgba(80, 80, 80, 0.1)';
            });
        });
        
        tableContainer.appendChild(tableClone);
        container.appendChild(tableContainer);
        
        // 添加點位資訊
        const pointsRow = document.querySelector('.points-row').cloneNode(true);
        pointsRow.style.cssText = 'display:flex; justify-content:space-between; background:#f9f9f9; border-radius:5px; padding:8px; margin-bottom:15px; border:1px solid #eee; font-size:12px;';
        container.appendChild(pointsRow);
        
        // 創建雷達圖區域
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'margin-top:15px; text-align:center;';
        
        // 添加雷達圖標題
        const chartTitle = document.createElement('h3');
        chartTitle.innerHTML = 'DISC 雷達圖';
        chartTitle.style.cssText = 'color:#333; margin-bottom:8px; font-size:16px;';
        chartContainer.appendChild(chartTitle);
        
        // 創建雷達圖畫布的容器
        const radarContainer = document.createElement('div');
        radarContainer.style.cssText = 'width:350px; height:350px; margin:0 auto; position:relative;';
        
        // 獲取原始雷達圖的圖像數據
        const originalCanvas = document.getElementById('radar-chart');
        const radarImg = document.createElement('img');
        radarImg.src = originalCanvas.toDataURL('image/png');
        radarImg.style.cssText = 'width:100%; height:100%; object-fit:contain;';
        
        radarContainer.appendChild(radarImg);
        chartContainer.appendChild(radarContainer);
        
        // 添加圖例
        const legend = document.querySelector('.legend').cloneNode(true);
        legend.style.cssText = 'display:flex; justify-content:center; gap:15px; margin-top:8px; font-size:12px;';
        chartContainer.appendChild(legend);
        
        container.appendChild(chartContainer);
        
        // 添加頁腳
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top:20px; text-align:center; font-size:11px; color:#777;';
        footer.innerHTML = '<p>&copy; coachmonents DISC人格測驗. 保留所有權利。</p>';
        container.appendChild(footer);
        
        return container;
    }
}