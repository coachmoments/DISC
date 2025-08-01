// 結果頁面的主要腳本

// 全局變量存儲點位數據，用於PDF生成
let globalPointsData = {
    external: { x: 0, y: 0 },
    internal: { x: 0, y: 0 },
    total: { x: 0, y: 0 }
};

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
    
    // 計算分數 (題目1-10為外在行為，11-20為內在思維)
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
                // 內在思維
                switch (answer) {
                    case 0: internal.D++; break;
                    case 1: internal.I++; break;
                    case 2: internal.S++; break;
                    case 3: internal.C++; break;
                }
            }
        }
    }
    
    // 計算綜合分數（平均值）
    const total = {
        D: Math.round((external.D + internal.D) / 2),
        I: Math.round((external.I + internal.I) / 2),
        S: Math.round((external.S + internal.S) / 2),
        C: Math.round((external.C + internal.C) / 2)
    };
    
    // 顯示分數
    // 外在行為
    document.getElementById('ext-d').textContent = external.D;
    document.getElementById('ext-i').textContent = external.I;
    document.getElementById('ext-s').textContent = external.S;
    document.getElementById('ext-c').textContent = external.C;
    
    // 內在思維
    document.getElementById('int-d').textContent = internal.D;
    document.getElementById('int-i').textContent = internal.I;
    document.getElementById('int-s').textContent = internal.S;
    document.getElementById('int-c').textContent = internal.C;
    
    // 綜合分數
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
    
    // 保存點位數據到全局變量，用於PDF生成
    globalPointsData.external = externalPoints;
    globalPointsData.internal = internalPoints;
    globalPointsData.total = totalPoints;
    
    // 點位數據已移除顯示，但保留計算用於雷達圖繪製
    
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
    
    // 設置Canvas尺寸 - 支援高DPI屏幕，根據容器大小自適應
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // 獲取設備像素比，支援高解析度屏幕
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // 設置顯示尺寸
    let displaySize;
    if (window.innerWidth <= 768) {
        // 手機版：提高最大尺寸限制，確保足夠的顯示空間
        displaySize = Math.min(containerWidth, 350);
    } else {
        displaySize = Math.min(containerWidth, 420);
    }
    
    // 設置CSS顯示尺寸
    canvas.style.width = displaySize + 'px';
    canvas.style.height = displaySize + 'px';
    
    // 設置實際Canvas繪製尺寸（考慮設備像素比）
    const actualSize = displaySize * devicePixelRatio;
    canvas.width = actualSize;
    canvas.height = actualSize;
    
    // 縮放繪製上下文以適應高DPI
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // 繪製雷達圖
    drawRadarChart(ctx, external, internal, total, points, displaySize);
}

// 繪製雷達圖
function drawRadarChart(ctx, external, internal, total, points, displaySize) {
    // 使用顯示尺寸而非實際Canvas尺寸來計算佈局
    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    
    // 計算最大半徑，確保圖表完全顯示
    let maxRadius;
    if (window.innerWidth <= 768) {
        maxRadius = displaySize * 0.32; // 手機版使用較小的半徑
    } else {
        maxRadius = displaySize * 0.35; // 桌面版使用原來的半徑
    }
    
    // 清除Canvas
    ctx.clearRect(0, 0, displaySize, displaySize);
    
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
    
    // 在四個角落繪製DISC字母
    ctx.font = `bold ${Math.max(16, Math.min(20, maxRadius / 8))}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 計算角落位置的偏移量
    const cornerOffset = maxRadius + Math.max(25, maxRadius / 6);
    
    // DISC字母在四個角落的位置（逆時針退一格後）
    const discCorners = [
        { letter: 'D', x: centerX - cornerOffset * 0.7, y: centerY - cornerOffset * 0.7, color: '#28a745' },  // 左上角 - 掌控型 (綠色)
        { letter: 'I', x: centerX + cornerOffset * 0.7, y: centerY - cornerOffset * 0.7, color: '#dc3545' },  // 右上角 - 影響型 (紅色)
        { letter: 'S', x: centerX + cornerOffset * 0.7, y: centerY + cornerOffset * 0.7, color: '#007bff' },  // 右下角 - 沉穩型 (藍色)
        { letter: 'C', x: centerX - cornerOffset * 0.7, y: centerY + cornerOffset * 0.7, color: '#ffc107' }   // 左下角 - 嚴謹型 (黃色)
    ];
    
    discCorners.forEach(corner => {
        // 繪製圓形背景
        ctx.fillStyle = corner.color;
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, Math.max(18, maxRadius / 12), 0, Math.PI * 2);
        ctx.fill();
        
        // 繪製字母
        ctx.fillStyle = corner.letter === 'C' ? '#333' : 'white';  // 黃色背景用深色字
        ctx.fillText(corner.letter, corner.x, corner.y);
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
    
    // 檢測是否為手機版
    const isMobile = window.innerWidth <= 768;
    
    // 根據設備類型調整點位大小和樣式
    let pointRadius, fontSize;
    if (isMobile) {
        // 手機版：小一點的純色點
        pointRadius = Math.max(4, Math.min(6, maxRadius / 25));
        fontSize = Math.max(8, Math.min(10, maxRadius / 18));
    } else {
        // 電腦版：原來的大小
        pointRadius = Math.max(6, Math.min(8, maxRadius / 20));
        fontSize = Math.max(10, Math.min(12, maxRadius / 15));
    }
    
    // 設置字體
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isMobile) {
        // 手機版：純色點
        
        // 繪製外顯點位（藍色純色）
        ctx.fillStyle = 'rgba(65, 105, 225, 1)';
        ctx.beginPath();
        ctx.arc(externalPoint.x, externalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 外顯點標記（白色字）
        ctx.fillStyle = 'white';
        ctx.fillText('E', externalPoint.x, externalPoint.y);
        
        // 繪製內在點位（紅色純色）
        ctx.fillStyle = 'rgba(220, 20, 60, 1)';
        ctx.beginPath();
        ctx.arc(internalPoint.x, internalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 內在點標記（白色字）
        ctx.fillStyle = 'white';
        ctx.fillText('I', internalPoint.x, internalPoint.y);
        
        // 繪製綜合點位（灰色純色）
        ctx.fillStyle = 'rgba(80, 80, 80, 1)';
        ctx.beginPath();
        ctx.arc(totalPoint.x, totalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 綜合點標記（白色字）
        ctx.fillStyle = 'white';
        ctx.fillText('T', totalPoint.x, totalPoint.y);
        
    } else {
        // 電腦版：空心圓樣式（保持原來的設計）
        
        // 繪製外顯點位（藍色空心圓）
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(65, 105, 225, 1)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(externalPoint.x, externalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 繪製內在點位（紅色空心圓）
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(220, 20, 60, 1)';
        
        ctx.beginPath();
        ctx.arc(internalPoint.x, internalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 繪製綜合點位（灰色空心圓）
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(80, 80, 80, 1)';
        
        ctx.beginPath();
        ctx.arc(totalPoint.x, totalPoint.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 添加點位標記（有色字）
        
        // 外顯點標記
        ctx.fillStyle = 'rgba(65, 105, 225, 1)';
        ctx.fillText('E', externalPoint.x, externalPoint.y);
        
        // 內顯點標記
        ctx.fillStyle = 'rgba(220, 20, 60, 1)';
        ctx.fillText('I', internalPoint.x, internalPoint.y);
        
        // 綜合點標記
        ctx.fillStyle = 'rgba(80, 80, 80, 1)';
        ctx.fillText('T', totalPoint.x, totalPoint.y);
    }
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
                    // 創建兩頁PDF容器
                    const { page1Container, page2Container } = createTwoPagePDFContainers();
                
                // 將容器添加到DOM中
                    document.body.appendChild(page1Container);
                    document.body.appendChild(page2Container);
                    
                    // 分別捕獲兩頁內容
                    Promise.all([
                        html2canvas(page1Container, {
                            scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                        }),
                        html2canvas(page2Container, {
                            scale: 2,
                            useCORS: true,
                            allowTaint: true,
                            logging: false,
                            backgroundColor: '#ffffff'
                        })
                    ]).then(([canvas1, canvas2]) => {
                    try {
                        // 移除臨時PDF容器
                            document.body.removeChild(page1Container);
                            document.body.removeChild(page2Container);
                        
                        // 創建PDF文檔
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        
                        // 設置PDF頁面尺寸和邊距
                            const pageWidth = 210;
                            const pageHeight = 297;
                            const margin = 15;
                        const contentWidth = pageWidth - (margin * 2);
                            const maxHeight = pageHeight - (margin * 2);
                            
                            // 添加第一頁
                            const img1Width = contentWidth;
                            const img1Height = Math.min((canvas1.height * img1Width) / canvas1.width, maxHeight);
                            const x1Offset = (pageWidth - img1Width) / 2;
                            
                            pdf.addImage(
                                canvas1.toDataURL('image/jpeg', 1.0),
                                'JPEG',
                                x1Offset,
                                margin,
                                img1Width,
                                img1Height
                            );
                            
                            // 添加第二頁
                            pdf.addPage();
                            const img2Width = contentWidth;
                            const img2Height = Math.min((canvas2.height * img2Width) / canvas2.width, maxHeight);
                            const x2Offset = (pageWidth - img2Width) / 2;
                            
                        pdf.addImage(
                                canvas2.toDataURL('image/jpeg', 1.0),
                            'JPEG',
                                x2Offset,
                            margin,
                                img2Width,
                                img2Height
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
    
    // 創建兩頁PDF容器並填充內容
    function createTwoPagePDFContainers() {
        // 創建第一頁容器
        const page1Container = document.createElement('div');
        page1Container.id = 'pdf-page1-container';
        page1Container.style.cssText = 'position:absolute; left:-9999px; width:780px; height:1120px; background-color:white; padding:15px; font-family:"Microsoft JhengHei", "Noto Sans TC", Arial, sans-serif; line-height:1.3; color:#333; overflow:visible;';
        
        // 創建第二頁容器
        const page2Container = document.createElement('div');
        page2Container.id = 'pdf-page2-container';
        page2Container.style.cssText = 'position:absolute; left:-9999px; width:780px; height:1200px; background-color:white; padding:20px; font-family:"Microsoft JhengHei", "Noto Sans TC", Arial, sans-serif; line-height:1.4; color:#333; overflow:visible;';
        
        // 創建頁眉區域
        const header = document.createElement('div');
        header.style.cssText = 'text-align:center; margin-bottom:15px; padding-bottom:10px; border-bottom:3px solid #4a6fa5;';
        
        // 添加LOGO
        const logo = document.createElement('img');
        logo.src = 'images/logo - blue.png';
        logo.style.cssText = 'width:60px; height:auto; margin-bottom:8px; display:block; margin-left:auto; margin-right:auto;';
        logo.onerror = function() {
            this.style.display = 'none';
        };
        header.appendChild(logo);
        
        // 主標題
        const mainTitle = document.createElement('div');
        mainTitle.innerHTML = 'DISCovery行為風格';
        mainTitle.style.cssText = 'font-size:24px; font-weight:bold; color:#4a6fa5; margin-bottom:3px; letter-spacing:1px;';
        header.appendChild(mainTitle);
        
        // 副標題
        const subTitle = document.createElement('div');
        subTitle.innerHTML = '測驗報告';
        subTitle.style.cssText = 'font-size:14px; color:#666; margin-bottom:5px;';
        header.appendChild(subTitle);
        
        page1Container.appendChild(header);
        
        // 創建用户信息區（簡化版）
        const userInfoContainer = document.createElement('div');
        userInfoContainer.style.cssText = 'margin-bottom:10px;';
        
        const userInfoTitle = document.createElement('div');
        userInfoTitle.innerHTML = '測驗資訊：';
        userInfoTitle.style.cssText = 'color:#4a6fa5; font-size:14px; font-weight:600; display:inline; margin-right:10px;';
        
        const userInfo = document.querySelector('.user-info').cloneNode(true);
        userInfo.style.cssText = 'display:inline; font-size:13px; color:#666;';
        
        // 簡化用戶信息項目樣式
        const userInfoItems = userInfo.querySelectorAll('.user-info-item');
        let infoText = '';
        userInfoItems.forEach((item, index) => {
            const label = item.querySelector('.user-info-label') || item.querySelector('.label');
            const value = item.querySelector('.user-info-value') || item.querySelector('.value');
            if (label && value) {
                if (index > 0) infoText += ' | ';
                infoText += `${label.textContent}: ${value.textContent}`;
            }
        });
        
        const infoSpan = document.createElement('span');
        infoSpan.innerHTML = infoText;
        infoSpan.style.cssText = 'font-size:13px; color:#666;';
        
        userInfoContainer.appendChild(userInfoTitle);
        userInfoContainer.appendChild(infoSpan);
        page1Container.appendChild(userInfoContainer);

        // 移除DISC維度說明以節省空間
        
        // 創建主內容區域（兩欄布局）
        const mainContent = document.createElement('div');
        mainContent.style.cssText = 'display:flex; gap:15px; margin-bottom:10px;';
        
        // 左欄：分數表格
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'flex:1; min-width:350px;';
        
        const scoreContainer = document.createElement('div');
        scoreContainer.style.cssText = 'margin-bottom:10px; padding:8px; background:white; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); border:1px solid #e1e4e8;';
        
        const scoreTitle = document.createElement('h3');
        scoreTitle.innerHTML = 'DISC 分數統計';
        scoreTitle.style.cssText = 'color:#4a6fa5; font-size:14px; margin:0 0 10px 0; font-weight:600; border-bottom:2px solid #4a6fa5; padding-bottom:4px; display:inline-block;';
        scoreContainer.appendChild(scoreTitle);
        
        // 獲取原始表格並重新設計
        const originalTable = document.querySelector('.disc-score-table');
        const tableClone = originalTable.cloneNode(true);
        tableClone.style.cssText = 'width:100%; border-collapse:separate; border-spacing:0; margin:0 auto; font-size:13px; border-radius:10px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.1);';
        
        // 設計表頭樣式
        const thead = tableClone.querySelector('thead');
        if (thead) {
            const headerCells = thead.querySelectorAll('th');
            headerCells.forEach((th, index) => {
                if (index === 0) {
                    th.style.cssText = 'background:#4a6fa5; color:white; font-weight:bold; padding:12px 15px; text-align:center; font-size:14px;';
                } else {
                    th.style.cssText = 'background:#4a6fa5; color:white; font-weight:bold; padding:12px 8px; text-align:center; font-size:14px;';
                }
            });
        }
        
        // 處理表格行樣式
        const tbody = tableClone.querySelector('tbody');
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                cells.forEach((td, colIndex) => {
                    if (colIndex === 0) {
                        // 類別單元格 - 橫式顯示
                        let bgColor = '#f8f9fa';
                        let textColor = '#333';
                        if (row.classList.contains('external-section')) {
                            bgColor = 'rgba(65, 105, 225, 0.1)';
                            textColor = 'rgba(65, 105, 225, 1)';
                        } else if (row.classList.contains('internal-section')) {
                            bgColor = 'rgba(220, 20, 60, 0.1)';
                            textColor = 'rgba(220, 20, 60, 1)';
                        } else if (row.classList.contains('total-section')) {
                            bgColor = 'rgba(80, 80, 80, 0.1)';
                            textColor = 'rgba(80, 80, 80, 1)';
                        }
                        td.style.cssText = `background:${bgColor}; color:${textColor}; font-weight:bold; padding:6px 10px; text-align:center; border-right:2px solid #dee2e6; font-size:13px; writing-mode:horizontal-tb;`;
                    } else {
                        // 數據單元格
                        let bgColor = 'white';
                        if (row.classList.contains('external-section')) {
                            bgColor = 'rgba(65, 105, 225, 0.05)';
                        } else if (row.classList.contains('internal-section')) {
                            bgColor = 'rgba(220, 20, 60, 0.05)';
                        } else if (row.classList.contains('total-section')) {
                            bgColor = 'rgba(80, 80, 80, 0.05)';
                        }
                        td.style.cssText = `background:${bgColor}; padding:8px 6px; text-align:center; border-bottom:1px solid #f0f0f0; font-size:16px; font-weight:bold; color:#333;`;
                    }
            });
        });
        }
        
        scoreContainer.appendChild(tableClone);
        leftColumn.appendChild(scoreContainer);
        
        // 右欄：雷達圖
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'flex:1; min-width:300px;';
        
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'padding:8px; background:white; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); border:1px solid #e1e4e8; text-align:center;';
        
        const chartTitle = document.createElement('h3');
        chartTitle.innerHTML = 'DISC 雷達圖';
        chartTitle.style.cssText = 'color:#4a6fa5; font-size:14px; margin:0 0 10px 0; font-weight:600; border-bottom:2px solid #4a6fa5; padding-bottom:4px; display:inline-block;';
        chartContainer.appendChild(chartTitle);
        
        // 創建雷達圖容器
        const radarContainer = document.createElement('div');
        radarContainer.style.cssText = 'width:280px; height:280px; margin:0 auto 10px auto; position:relative; background:#fafafa; border-radius:8px; padding:10px; box-sizing:border-box;';
        
        // 獲取原始雷達圖的圖像數據
        const originalCanvas = document.getElementById('radar-chart');
        const radarImg = document.createElement('img');
        radarImg.src = originalCanvas.toDataURL('image/png');
        radarImg.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:4px;';
        
        radarContainer.appendChild(radarImg);
        chartContainer.appendChild(radarContainer);
        
        // 添加簡化的圖例
        const legendContainer = document.createElement('div');
        legendContainer.style.cssText = 'background:#f8f9fa; border-radius:6px; padding:8px; border:1px solid #dee2e6;';
        
        const legend = document.querySelector('.legend').cloneNode(true);
        legend.style.cssText = 'display:flex; justify-content:center; gap:15px; font-size:11px;';
        
        // 優化圖例項目樣式
        const legendItems = legend.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            item.style.cssText = 'display:flex; align-items:center; gap:4px; background:white; padding:4px 8px; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border:1px solid #e1e4e8;';
            
            const marker = item.querySelector('.point-marker');
            if (marker) {
                marker.style.cssText = marker.style.cssText + ' width:16px; height:16px; font-size:10px;';
            }
            
            const text = item.querySelector('.legend-text');
            if (text) {
                text.style.cssText = 'font-size:10px; color:#666; font-weight:500;';
            }
        });
        
        legendContainer.appendChild(legend);
        chartContainer.appendChild(legendContainer);
        rightColumn.appendChild(chartContainer);
        
        mainContent.appendChild(leftColumn);
        mainContent.appendChild(rightColumn);
        page1Container.appendChild(mainContent);
        
        // 點位座標欄位已移除 - PDF第一頁表格下方保持空白
        
        // 創建第二頁頁眉 (簡化版)
        const page2Header = document.createElement('div');
        page2Header.style.cssText = 'text-align:center; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid #4a6fa5;';
        
        const page2Title = document.createElement('div');
        page2Title.innerHTML = 'DISCovery行為風格 - 第2頁';
        page2Title.style.cssText = 'font-size:20px; font-weight:bold; color:#4a6fa5; letter-spacing:1px;';
        page2Header.appendChild(page2Title);
        
        page2Container.appendChild(page2Header);
        
        // 在第一頁底部添加LINE詢問區域
        const lineSection = document.createElement('div');
        lineSection.style.cssText = 'margin-top:10px; margin-bottom:10px; padding:10px; background:linear-gradient(135deg, #e8f2ff 0%, #f0f7ff 100%); border-radius:8px; border:1px solid #4a6fa5; text-align:center;';
        
        // LINE詢問說明文字
        const lineText = document.createElement('div');
        lineText.innerHTML = '🔗 想了解更多DISC資訊？';
        lineText.style.cssText = 'font-size:12px; color:#2c3e50; margin-bottom:6px; font-weight:500;';
        lineSection.appendChild(lineText);
        
        // LINE連結
        const lineLink = document.createElement('a');
        lineLink.href = 'https://lin.ee/RaehHxl';
        lineLink.target = '_blank';
        lineLink.innerHTML = '加入JCoach官方LINE：@https://lin.ee/RaehHxl';
        lineLink.style.cssText = 'font-size:11px; color:#4a6fa5; text-decoration:underline; font-weight:600;';
        lineSection.appendChild(lineLink);
        
        page1Container.appendChild(lineSection);
        
        // 添加頁腳到第一頁
        const footerPage1 = document.createElement('div');
        footerPage1.style.cssText = 'margin-top:8px; padding-top:8px; border-top:1px solid #4a6fa5; text-align:center; color:#666;';
        
        const footerContentPage1 = document.createElement('div');
        footerContentPage1.style.cssText = 'display:flex; justify-content:space-between; align-items:center; font-size:10px;';
        
        const copyrightPage1 = document.createElement('div');
        copyrightPage1.innerHTML = '&copy; CoachMoments DISC人格測驗. 保留所有權利。';
        copyrightPage1.style.cssText = 'font-weight:500;';
        
        const reportInfoPage1 = document.createElement('div');
        reportInfoPage1.innerHTML = `報告生成日期：${new Date().toLocaleDateString('zh-TW')}`;
        reportInfoPage1.style.cssText = 'font-style:italic; color:#888;';
        
        footerContentPage1.appendChild(copyrightPage1);
        footerContentPage1.appendChild(reportInfoPage1);
        footerPage1.appendChild(footerContentPage1);
        
        page1Container.appendChild(footerPage1);
        
        // 第二頁留空或添加簡單說明
        const page2Note = document.createElement('div');
        page2Note.innerHTML = '此報告已優化為單頁版本';
        page2Note.style.cssText = 'text-align:center; color:#666; padding:50px; font-size:14px;';
        page2Container.appendChild(page2Note);
        
        return { page1Container, page2Container };
    }
}