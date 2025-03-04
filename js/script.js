// 通用功能
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// LocalStorage 管理函數
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('保存數據失敗:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('讀取數據失敗:', error);
        return null;
    }
}

function clearLocalStorageData() {
    // 清除用戶基本資料
    localStorage.removeItem('discUserName');
    localStorage.removeItem('discAnswers');
    localStorage.removeItem('discTestStartTime');
    localStorage.removeItem('discTestEndTime');
    localStorage.removeItem('discMappedAnswers');
    
    // 清除計算結果
    localStorage.removeItem('discExternal');
    localStorage.removeItem('discInternal');
    localStorage.removeItem('discTotal');
    
    // 清除組合分數
    localStorage.removeItem('discExternalCombinations');
    localStorage.removeItem('discInternalCombinations');
    localStorage.removeItem('discTotalCombinations');
    localStorage.removeItem('discCombinations');
    
    // 清除點位資料
    localStorage.removeItem('discExternalPoints');
    localStorage.removeItem('discInternalPoints');
    localStorage.removeItem('discTotalPoints');
    localStorage.removeItem('discPoints');
    
    // 清除其他資料
    localStorage.removeItem('discPercentages');
    
    console.log('已清理所有DISC測驗相關數據');
}

// 建立當前頁面連結的 active 狀態
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
}

// 頁面加載時執行
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
}); 