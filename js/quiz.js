// 問題數據
const quizQuestions = [
    {
        id: 1,
        question: "當您和朋友一起用餐，在選餐廳或是吃什麼時，您常是:",
        options: [
            "A.決定者 : 意見不同時，通常都是決定者。",
            "B.氣氛製造者 : 吃什麼，吃什麼，很能帶動情緒氣氛。",
            "C.附和者 : 隨便沒意見。",
            "D.意見提供者 : 常去否定別人之提議，自己卻又沒意見，不做決定。"
        ]
    },
    {
        id: 2,
        question: "當您買衣服時您，您是:",
        options: [
            "A.不易受售貨員之影響，〝心中自有定見〞。",
            "B.售貨員的親切及好的感受，常會促進您的購買。",
            "C.找熟悉的店購買。",
            "D.品質與價錢是否成比例，價錢是否合理。"
        ]
    },
    {
        id: 3,
        question: "您的消費習慣是:",
        options: [
            "A.找到要買的東西，付錢走人。",
            "B.很隨意的逛，不特定買什麼。",
            "C.有一定的消費習慣，時間不太喜歡變化。",
            "D.較注意東西好不好，較有成本觀念。"
        ]
    },
    {
        id: 4,
        question: "您的朋友，以一句話來形容您，他們會說:",
        options: [
            "A.蠻〝鴨霸〞的",
            "B.熱情洋溢。",
            "C.溫和斯文。",
            "D.要求完美。"
        ]
    },
    {
        id: 5,
        question: "您自認為那一種形容最能表現您的特色:",
        options: [
            "A.果敢的，能接受挑戰。",
            "B.生動活潑，不拘禮。",
            "C.愛傾聽，喜歡穩定。",
            "D.處世謹慎小心，重數據分析。"
        ]
    },
    {
        id: 6,
        question: "您覺得作事的重點，應該是:",
        options: [
            "A. What，做什麼，重結果。",
            "B. Who，誰來做， 重感受(過程)。",
            "C. How，怎麼做，重執行。",
            "D. Why，為何做，重品質。"
        ]
    },
    {
        id: 7,
        question: "與同事有意見衝突(或不同)時，您是:",
        options: [
            "A.說服對方，聽從自己的意見。",
            "B.找其他同事或上司之意見，尋求支持。",
            "C.退讓，以和為貴。",
            "D.與衝突者協調，找尋最好的意見。"
        ]
    },
    {
        id: 8,
        question: "什麼樣的工作環境，最能鼓舞您:",
        options: [
            "A.能讓您決定事情，具領導地位的。",
            "B.同事相處愉快，處處受歡迎。",
            "C.穩定中求發展。",
            "D.講品質，重效率的工作。"
        ]
    },
    {
        id: 9,
        question: "以下的溝通方式，那一項最符合您:",
        options: [
            "A.直截了當，較權威式的。",
            "B.表情豐富，肢體語言較多。",
            "C.先聽聽別人的意見，而後溫和的表達自己的意見。",
            "D.不露感情的，理多於情，愛分析，較冷靜。"
        ]
    },
    {
        id: 10,
        question: "在每一次會議中或公司決議提案時您所扮演的角色為何:",
        options: [
            "A.據理力爭。",
            "B.協調者。",
            "C.贊同多數。",
            "D.分析所有提案以供參考。"
        ]
    },
    {
        id: 11,
        question: "",
        options: [
            "A: 我做事一向以具體,短期能達到目標;決定快速,立即得到結果。",
            "B: 在本性上我喜歡跟人交往,各式樣的人都行,甚至陌生人也行。",
            "C: 我不喜歡強出頭,寧可當後補。",
            "D: 我是一個自我約束,很守紀律的人,凡事依既定目標行事。"
        ]
    },
    {
        id: 12,
        question: "",
        options: [
            "A: 我喜歡有變化,有力激烈的,競爭的,是個可接受挑戰的人。",
            "B: 我喜歡社交,也喜歡款待人。",
            "C: 我喜歡成為小組的一份子,固守一般的程序。",
            "D: 我會花很多時間去研究事與人。"
        ]
    },
    {
        id: 13,
        question: "",
        options: [
            "A: 我喜歡按自己的方式做事,不在乎別人對我的觀感,只要成功。",
            "B: 有人跟我的意見不一致時, 我會很難過(困擾)。",
            "C: 我知道做些改變是有必要的,但即使如此我還是覺得少冒險來的好。",
            "D: 我對自己及他人的期望很高,這些都是為了符合我的高標準。"
        ]
    },
    {
        id: 14,
        question: "",
        options: [
            "A: 我擅長於處理棘手的問題。",
            "B: 我是個很熱心的人,我喜歡跟別人工作。",
            "C: 我喜歡聽而不喜歡說話,我一開口都說得很委婉溫和。",
            "D: 處理事我較不動感情,是就是,不把感情牽扯進來,也較少與人閒聊。"
        ]
    },
    {
        id: 15,
        question: "",
        options: [
            "A: 我喜歡有競爭,有競爭才能把潛完全發揮出來。",
            "B: 我較感性,與人相處,處事較不注意細節。",
            "C: 我是個天生的組員,順著群眾。",
            "D: 對事我喜歡去研究,講求證據與保證。"
        ]
    },
    {
        id: 16,
        question: "",
        options: [
            "A: 我喜歡能力與權威,這是我想要的。",
            "B: 我有時候很情緒化,一旦生氣都氣過頭,有時置身於有趣事務中,往往無法掌握時間。",
            "C: 我喜歡按部就班,穩紮穩打,慢慢地做事而不喜歡破釜沈舟。",
            "D: 我很注重事務與人的細節。"
        ]
    },
    {
        id: 17,
        question: "",
        options: [
            "A: 對直接關係的環境,我有傾向喜歡去掌握及支配他人。",
            "B: 在團體中我喜歡打成一片,活活潑潑有氣氛,有感情的相處。",
            "C: 我較遵守傳統的步驟做事,不喜歡有大的變化。",
            "D: 在沒有掌握事實的真象,更多資料之前,我寧可保持現狀。"
        ]
    },
    {
        id: 18,
        question: "",
        options: [
            "A: 我在與人溝通時,直接了當的說,不喜歡兜圈子。",
            "B: 我喜歡幫助人,相親相愛。",
            "C: 我不喜歡多變化的環境而要穩定安全生活方式。",
            "D: 凡事我要求的是準確無誤,講求的是高品質,高標準的處事原則。"
        ]
    },
    {
        id: 19,
        question: "",
        options: [
            "A: 我不喜歡別人逗我開心,不喜歡太多話的人。",
            "B: 我喜歡參加團體活動,因為與多數人在一起很好。",
            "C: 對事情我沒有太多要求與意見,喜歡靜靜的有耐心的做。",
            "D: 我做事要有一套經過計劃設計的標準作業程序來引導作業方向。"
        ]
    },
    {
        id: 20,
        question: "",
        options: [
            "A: 我討厭別人告訴我事情該如何做,因為我自有一套,我不喜歡被別人支配。",
            "B: 我是個生氣蓬勃外向的人,別人愛跟我一起工作,因為別人跟我在一起工作,我會激起熱心,我就是有那個能耐。",
            "C: 我喜歡獨處,與人生活在一起會注意儘量不去打擾他人居家生活。",
            "D: 我很少加入別人的閒聊中,當話題有趣時,我會找更多的資料,小心的進行外交策略。"
        ]
    }
];

// 當前頁碼，從0開始（第一頁）
let currentPage = 0;
// 每頁顯示的問題數量
const questionsPerPage = 5;
// 總頁數
const totalPages = Math.ceil(quizQuestions.length / questionsPerPage);

// 獲取答案數組
let answers = getFromLocalStorage('discAnswers') || Array(quizQuestions.length).fill(null);

// 全局變量
let hasStartedQuiz = false; // 添加標記，跟踪用戶是否已經開始測驗

// 在文檔加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 顯示用戶名
    const userName = getFromLocalStorage('discUserName');
    if (!userName) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('user-name-display').textContent = userName;
    
    // 設置總問題數量
    document.getElementById('total-count').textContent = quizQuestions.length;
    
    // 初始化分頁
    setupPagination();
    
    // 顯示第一頁問題
    showQuestions(currentPage);
    
    // 設置自動保存
    setupAutoSave();
    
    // 載入已保存的答案
    loadSavedAnswers();
    
    // 更新進度條
    updateProgressBar();
    
    // 更新已回答問題數量
    updateAnsweredCount();
    
    // 設置導航按鈕事件
    setupButtonEvents();
    
    // 設置導航按鈕狀態
    updateNavigationButtons();
    
    // 調試信息
    console.log('DOM加載完成，初始化完成');
});

// 設置自動保存
function setupAutoSave() {
    // 每次答案變化時自動保存
    document.addEventListener('answerChanged', function() {
        saveToLocalStorage('discAnswers', answers);
        console.log('答案已自動保存', answers);
    });
}

// 設置分頁
function setupPagination() {
    const paginationContainer = document.querySelector('.pagination-indicators');
    paginationContainer.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const pageIndicator = document.createElement('div');
        pageIndicator.className = 'page-indicator';
        pageIndicator.textContent = i + 1;
        pageIndicator.dataset.page = i;
        
        if (i === currentPage) {
            pageIndicator.classList.add('active');
        }
        
        // 添加點擊事件
        pageIndicator.addEventListener('click', function() {
            const targetPage = parseInt(this.dataset.page);
            
            // 如果當前頁有未回答的問題，提示用戶
            if (!allQuestionsAnsweredOnCurrentPage() && currentPage !== targetPage) {
                const confirm = window.confirm('當前頁面有未回答的問題，確定要切換到其他頁面嗎？');
                if (!confirm) return;
            }
            
            currentPage = targetPage;
            showQuestions(currentPage);
            updatePaginationActive();
            updateNavigationButtons();
            
            // 滾動到頁面頂部的第一題
            scrollToFirstQuestionOnPage();
        });
        
        paginationContainer.appendChild(pageIndicator);
    }
}

// 更新分頁激活狀態
function updatePaginationActive() {
    const paginationItems = document.querySelectorAll('.page-indicator');
    
    paginationItems.forEach((item, index) => {
        if (index === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 顯示問題
function showQuestions(page) {
    const quizContent = document.querySelector('.quiz-content');
    quizContent.innerHTML = '';
    
    // 計算當前頁的問題範圍
    const startIdx = page * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, quizQuestions.length);
    
    // 生成問題HTML
    for (let i = startIdx; i < endIdx; i++) {
        const question = quizQuestions[i];
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';
        questionDiv.dataset.id = question.id;
        questionDiv.dataset.index = i; // 添加問題索引作為屬性
        
        // 已經開始測驗且沒有回答的問題會標記為未回答
        if (hasStartedQuiz && answers[i] === null) {
            questionDiv.classList.add('unanswered');
        }
        
        // 問題標題
        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${question.id}. ${question.question}`;
        questionHeader.appendChild(questionTitle);
        questionDiv.appendChild(questionHeader);
        
        // 選項容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // 生成選項
        question.options.forEach((optionText, optionIndex) => {
            const option = document.createElement('div');
            option.className = 'option';
            option.dataset.questionId = question.id;
            option.dataset.questionIndex = i; // 修正：使用問題在答案數組中的索引
            option.dataset.optionIndex = optionIndex;
            
            // 如果已經選擇了該選項，添加selected類
            if (answers[i] === optionIndex) {
                option.classList.add('selected');
            }
            
            // 選項標籤（A/B/C/D）
            const optionLabels = ['A', 'B', 'C', 'D'];
            const labelSpan = document.createElement('span');
            labelSpan.className = 'option-label';
            labelSpan.textContent = optionLabels[optionIndex];
            option.appendChild(labelSpan);
            
            // 選項文本
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            
            // 處理選項文本格式
            let formattedText = optionText;
            if (optionText.includes('.')) {
                formattedText = optionText.split('.').slice(1).join('.').trim();
            } else if (optionText.includes(':')) {
                formattedText = optionText.split(':').slice(1).join(':').trim();
            }
            
            textSpan.textContent = formattedText;
            option.appendChild(textSpan);
            
            // 添加到選項容器
            optionsContainer.appendChild(option);
        });
        
        questionDiv.appendChild(optionsContainer);
        quizContent.appendChild(questionDiv);
    }
    
    // 設置選項點擊事件
    setupOptionEvents();
}

// 設置選項事件
function setupOptionEvents() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            // 標記用戶已經開始測驗
            hasStartedQuiz = true;
            
            const questionIndex = parseInt(this.dataset.questionIndex);
            const optionIndex = parseInt(this.dataset.optionIndex);
            
            console.log('選項被點擊', questionIndex, optionIndex);
            
            // 取消同一問題的其他選中狀態
            const questionOptions = document.querySelectorAll(`.option[data-question-index="${questionIndex}"]`);
            questionOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 設置當前選項為選中狀態
            this.classList.add('selected');
            
            // 保存答案
            answers[questionIndex] = optionIndex;
            
            // 觸發答案變化事件
            document.dispatchEvent(new Event('answerChanged'));
            
            // 移除未回答標記
            const questionCard = document.querySelector(`.question-card[data-index="${questionIndex}"]`);
            if (questionCard) {
                questionCard.classList.remove('unanswered');
            }
            
            // 更新進度條和已回答數量
            updateProgressBar();
            updateAnsweredCount();
            
            // 更新導航按鈕狀態
            updateNavigationButtons();
        });
    });
}

// 更新進度條
function updateProgressBar() {
    const answeredCount = answers.filter(a => a !== null).length;
    const progressPercentage = (answeredCount / quizQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
}

// 設置按鈕事件
function setupButtonEvents() {
    console.log('設置按鈕事件');
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!prevBtn || !nextBtn || !submitBtn) {
        console.error('按鈕元素未找到');
        return;
    }
    
    // 上一頁按鈕
    prevBtn.addEventListener('click', function() {
        console.log('上一頁按鈕被點擊');
        if (currentPage > 0) {
            currentPage--;
            showQuestions(currentPage);
            updatePaginationActive();
            updateNavigationButtons();
            
            // 滾動到頁面頂部的第一題
            scrollToFirstQuestionOnPage();
        }
    });
    
    // 下一頁按鈕
    nextBtn.addEventListener('click', function() {
        console.log('下一頁按鈕被點擊');
        
        // 標記用戶已經開始測驗
        hasStartedQuiz = true;
        
        // 檢查當前頁面是否有未回答的問題
        const hasUnanswered = !allQuestionsAnsweredOnCurrentPage();
        
        if (hasUnanswered) {
            // 高亮顯示未回答的問題
            highlightUnansweredQuestions();
            
            // 提示用戶有未回答的問題
            alert('請回答所有問題後再繼續！');
            return; // 阻止進入下一頁
        }
        
        // 移動到下一頁
        if (currentPage < totalPages - 1) {
            currentPage++;
            showQuestions(currentPage);
            updatePaginationActive();
            updateNavigationButtons();
            
            // 滾動到頁面頂部的第一題
            scrollToFirstQuestionOnPage();
        }
    });
    
    // 提交按鈕
    submitBtn.addEventListener('click', function() {
        console.log('提交按鈕被點擊');
        
        // 檢查是否所有問題已回答
        const missingAnswers = answers.filter(a => a === null).length;
        
        if (missingAnswers > 0) {
            // 找出第一個未回答的問題索引
            const firstUnansweredIndex = answers.findIndex(a => a === null);
            // 計算該問題在哪一頁
            const pageWithUnanswered = Math.floor(firstUnansweredIndex / questionsPerPage);
            
            // 跳轉到包含未回答問題的頁面
            if (currentPage !== pageWithUnanswered) {
                currentPage = pageWithUnanswered;
                showQuestions(currentPage);
                updatePaginationActive();
                updateNavigationButtons();
            }
            
            // 高亮顯示當前頁面上的未回答問題
            highlightUnansweredQuestions();
            
            alert(`您還有 ${missingAnswers} 個問題未回答，請完成所有問題。`);
            return;
        }
        
        // 保存完成時間
        saveToLocalStorage('discTestEndTime', new Date().toISOString());
        
        // 計算DISC對應
        mapAnswersToDISC();
        
        // 跳轉到結果頁面
        window.location.href = 'results.html';
    });
}

// 新增函數：滾動到當前頁面的第一個問題
function scrollToFirstQuestionOnPage() {
    setTimeout(() => {
        const firstQuestion = document.querySelector('.question-card');
        if (firstQuestion) {
            firstQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('滾動到第一個問題');
        }
    }, 50); // 短暫延遲確保DOM已更新
}

// 映射答案到DISC
function mapAnswersToDISC() {
    // 選項A對應D型，選項B對應I型，選項C對應S型，選項D對應C型
    const mappedAnswers = answers.map(answer => {
        if (answer === null) return null;
        
        // 0->D, 1->I, 2->S, 3->C
        return ['D', 'I', 'S', 'C'][answer];
    });
    
    saveToLocalStorage('discMappedAnswers', mappedAnswers);
}

// 更新導航按鈕狀態
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!prevBtn || !nextBtn || !submitBtn) {
        console.error('按鈕元素未找到');
        return;
    }
    
    // 確保按鈕容器有相對定位，以便絕對定位的按鈕能正確顯示
    const navButtons = document.querySelector('.navigation-buttons');
    if (navButtons) {
        navButtons.style.position = 'relative';
    }
    
    // 第一頁禁用上一頁按鈕
    prevBtn.disabled = currentPage === 0;
    
    // 最後一頁顯示提交按鈕，隱藏下一頁按鈕
    if (currentPage === totalPages - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        
        // 檢查是否所有問題都已回答
        const allAnswered = answers.every(answer => answer !== null);
        
        // 如果所有問題都已回答，添加脈動效果
        if (allAnswered) {
            submitBtn.classList.add('pulse-button');
        } else {
            submitBtn.classList.remove('pulse-button');
        }
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// 載入已保存的答案
function loadSavedAnswers() {
    const savedAnswers = getFromLocalStorage('discAnswers');
    
    if (savedAnswers && Array.isArray(savedAnswers)) {
        answers = savedAnswers;
        
        // 如果有已保存的答案，表示已經開始測驗
        if (savedAnswers.some(answer => answer !== null)) {
            hasStartedQuiz = true;
        }
        
        // 根據已回答的問題數確定應該顯示的頁面
        const answeredQuestions = answers.filter(a => a !== null).length;
        
        if (answeredQuestions > 0) {
            // 找到第一個未回答的問題所在頁
            const firstUnansweredIndex = answers.findIndex(a => a === null);
            if (firstUnansweredIndex !== -1) {
                currentPage = Math.floor(firstUnansweredIndex / questionsPerPage);
            } else {
                // 所有問題已回答，顯示最後一頁
                currentPage = totalPages - 1;
            }
        }
        
        // 顯示當前頁面的問題
        showQuestions(currentPage);
        updatePaginationActive();
        updateProgressBar();
        updateAnsweredCount();
        updateNavigationButtons();
    }
}

// 檢查當前頁面的所有問題是否都已回答
function allQuestionsAnsweredOnCurrentPage() {
    const startIdx = currentPage * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, quizQuestions.length);
    
    console.log('檢查當前頁面答案', startIdx, endIdx, answers.slice(startIdx, endIdx));
    
    for (let i = startIdx; i < endIdx; i++) {
        if (answers[i] === null) {
            return false;
        }
    }
    
    return true;
}

// 高亮顯示未回答的問題
function highlightUnansweredQuestions() {
    console.log('高亮未回答問題');
    
    const startIdx = currentPage * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, quizQuestions.length);
    
    let firstUnanswered = null;
    
    for (let i = startIdx; i < endIdx; i++) {
        if (answers[i] === null) {
            const questionCard = document.querySelector(`.question-card[data-index="${i}"]`);
            if (questionCard) {
                questionCard.classList.add('unanswered-highlight');
                
                if (!firstUnanswered) {
                    firstUnanswered = questionCard;
                }
                
                // 3秒後移除高亮效果，但保留未回答標記
                setTimeout(() => {
                    questionCard.classList.remove('unanswered-highlight');
                }, 3000);
            }
        }
    }
    
    // 滾動到第一個未回答的問題
    if (firstUnanswered) {
        firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// 更新已回答問題數量
function updateAnsweredCount() {
    const answeredCount = answers.filter(a => a !== null).length;
    document.getElementById('answered-count').textContent = answeredCount;
}