// =======================================================
// إعدادات API (يجب تغييرها)
// =======================================================

// 🛑 1. مفتاح API (يجب أن يكون سرياً)
const apiKey = '45a30abbea3343b8b930619bc03ab986'; 
const queryTopic = 'technology'; 

// 🛑 2. تكوين رابط API الكامل والمصرح به
const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${queryTopic}&pageSize=5&apiKey=${apiKey}`;

// =======================================================
// وظائف فتح وإغلاق نافذة الأخبار
// =======================================================

// تأكد من وجود العنصر في HTML (تمت إضافته في التعديل السابق)
const newsLaunchIcon = document.getElementById('news-launch-icon');
const newsWindow = document.getElementById('news-feed-window');
const closeNewsButton = document.getElementById('close-news-button');

// دالة الفتح:
function openNewsWindow() {
    newsWindow.style.display = 'block';
    // نعيد جلب الأخبار عند كل فتح للتأكد من أنها محدثة
    fetchLatestNews(); 
}

// دالة الإغلاق:
function closeNewsWindow() {
    newsWindow.style.display = 'none';
}

// ربط الأحداث (Event Listeners)
// هذا يتحقق من وجود العناصر لتجنب أخطاء JavaScript إذا لم يتم تحميل العنصر بعد
if (newsLaunchIcon && newsWindow && closeNewsButton) {
    newsLaunchIcon.addEventListener('click', openNewsWindow);
    closeNewsButton.addEventListener('click', closeNewsWindow);
}


// =======================================================
// وظيفة الساعة (Time)
// =======================================================
function updateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const timeElement = document.getElementById('digital-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// =======================================================
// وظيفة التاريخ (Date)
// =======================================================
function updateDate() {
    const now = new Date();
    
    const locale = 'en-us'; 
    
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
    };
    
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
             let errorMessage = `ops, loading news, please wait${response.status})`;
             
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
                <p>${article.description || 'لا يوجد وصف متاح.'}</p>
                <span class="source">المصدر: ${article.source.name}</span>
            `;

            newsContainer.appendChild(newsItem);
        });

    } catch (error) {
        console.error("problem while getting news", error.message);
        newsContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// =======================================================
// تشغيل الدوال الأساسية
// =======================================================

updateTime();
updateDate();
// تحديث الساعة كل ثانية
setInterval(updateTime, 1000); 

// لا داعي لتكرار جلب الأخبار هنا، لأنها تُجلب عند فتح النافذة
// يمكنك تفعيلها هنا إذا كنت تريد جلبها في الخلفية بشكل دوري
// setInterval(fetchLatestNews, 600000);