// =======================================================
// إعدادات API والثوابت
// =======================================================
const apiKey = '45a30abbea3343b8b930619bc03ab986'; 
const queryTopic = 'technology'; 
const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${queryTopic}&pageSize=5&apiKey=${apiKey}`;

// 💡 محتوى HTML الخاص بتطبيق D Apps
const dAppsHTMLContent = `        <style>body{background-color: rgba(0, 0, 0, 0.493);}</style>
    <h1>WELCOME TO D APPS</h1>
    <p>D apps is a web application that allows you to access and use various decentralized applications (DApps) built on it. .</p>
    <h2>famous apps</h2>
    <ul>
        <li><a href="Apps/calculator.html" target="_Self">DApp 1</a> - A popular decentralized finance application.</li>
        <li><a href="https://example-dapp2.com" target="_blank">DApp 2</a> - A well-known NFT marketplace.</li>
        <li><a href="https://example-dapp3.com" target="_blank">DApp 3</a> - A leading decentralized social media platform.</li>
    </ul>
`;


// =======================================================
// متغيرات النوافذ
// =======================================================
let newsWindowElement;
let dAppsWindowElement; 

// =======================================================
// وظائف الفتح والإغلاق العامة
// =======================================================

function closeWindow(windowElement) {
    if (windowElement) {
        windowElement.style.display = 'none';
    }
}

// ------------------- وظائف الأخبار -------------------
function openNewsWindow() {
    if (newsWindowElement) {
        newsWindowElement.style.display = 'block';
        fetchLatestNews(); 
    }
}

function closeNewsWindow() {
    closeWindow(newsWindowElement);
}

// ------------------- وظائف D Apps -------------------
function openDAppsWindow() {
    if (dAppsWindowElement) {
        // 1. عرض النافذة
        dAppsWindowElement.style.display = 'block';
        
        // 2. تحديث المحتوى بـ HTML المخصص
        const contentContainer = document.getElementById('d-apps-content');
        if (contentContainer) {
            contentContainer.innerHTML = dAppsHTMLContent;
        }
    }
}

function closeDAppsWindow() {
    closeWindow(dAppsWindowElement);
}

// =======================================================
// وظائف الساعة والتاريخ
// =======================================================
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`; // تم إزالة المسافة الزائدة
    const timeElement = document.getElementById('digital-time');
    if (timeElement) {
        timeElement.textContent = timeString; 
    }
}

function updateDate() {
    const now = new Date();
    const locale = 'en-us'; 
    const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateString = now.toLocaleDateString(locale, options); 
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// =======================================================
// وظيفة الأخبار (News Fetch)
// =======================================================
async function fetchLatestNews() {
    const newsContainer = document.getElementById('news-feed');
    
    try {
        const response = await fetch(newsApiUrl);
        
        if (!response.ok) {
             const errorData = await response.json();
             let errorMessage = `ops, loading news, please wait (${response.status})`;
             
             if (response.status === 401) {
                 errorMessage += ' - key not true.';
             } else if (response.status === 404) {
                 errorMessage += ' - (problem with API (wrong).';
             } else if (response.status === 429) {
                 errorMessage += ' - you can not use this number of calls.';
             }
             
             throw new Error(errorMessage);
        }
        
        const data = await response.json();
        const articles = data.articles.slice(0, 5); 

        newsContainer.innerHTML = ''; 

        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            
            const newsImage = article.urlToImage ? `<img src="${article.urlToImage}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;">` : '';

            newsItem.innerHTML = `
                ${newsImage}
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p>${article.description || 'no description'}</p>
                <span class="source">source: ${article.source.name}</span>
            `;

            newsContainer.appendChild(newsItem);
        });

    } catch (error) {
        console.error("problem while getting news", error.message);
        newsContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// =======================================================
// وظيفة السحب والتحريك (Draggable) - Vanilla JS
// =======================================================
function makeElementDraggable(element, dragHandle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    const handleToUse = dragHandle || element; 
    
    handleToUse.onmousedown = dragMouseDown;
    handleToUse.style.cursor = 'grab';

    function dragMouseDown(e) {
        e = e || window.event;
        // السماح بمرور النقر على زر الإغلاق
        if (e.target.closest('.close-btn')) return; 
        
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// =======================================================
// 💥 تشغيل الدوال وربط الأحداث (بعد تحميل الـ DOM)
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. وظيفة عرض اسم المستخدم (من localStorage)
    const displayElements = document.querySelectorAll('.DisplayName');
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        displayElements.forEach(element => {
            element.textContent = savedName;
        });
    }

    // 2. جلب عناصر نافذة الأخبار
    const newsLaunchIcon = document.getElementById('news-launch-icon');
    newsWindowElement = document.getElementById('news-feed-window'); 
    const closeNewsButton = document.getElementById('close-news-button');

    // 3. جلب عناصر نافذة D Apps
    const dAppsLaunchIcon = document.getElementById('d-apps-launch-icon');
    dAppsWindowElement = document.getElementById('d-apps-window'); 
    const closeDAppsButton = document.getElementById('close-d-apps-button');
    
    // 4. ربط أحداث نافذة الأخبار
    if (newsLaunchIcon && newsWindowElement && closeNewsButton) {
        newsLaunchIcon.addEventListener('click', openNewsWindow);
        closeNewsButton.addEventListener('click', closeNewsWindow);
    }

    // 5. ربط أحداث نافذة D Apps
    if (dAppsLaunchIcon && dAppsWindowElement && closeDAppsButton) {
        dAppsLaunchIcon.addEventListener('click', openDAppsWindow);
        closeDAppsButton.addEventListener('click', closeDAppsWindow);
    }

    // 6. تفعيل السحب على نافذة الأخبار 
    const newsHandle = newsWindowElement ? newsWindowElement.querySelector('.drag-handle') : null;
    if (newsWindowElement && newsHandle) {
        makeElementDraggable(newsWindowElement, newsHandle);
    }
    
    // 7. تفعيل السحب على نافذة D Apps
    const dAppsHandle = dAppsWindowElement ? dAppsWindowElement.querySelector('.drag-handle') : null;
    if (dAppsWindowElement && dAppsHandle) {
        makeElementDraggable(dAppsWindowElement, dAppsHandle);
    }
    
    // 8. تشغيل وظائف الساعة والتاريخ
    updateTime();
    updateDate();
    setInterval(updateTime, 1000); 
});