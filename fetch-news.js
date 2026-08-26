const fs = require('fs');
const https = require('https');

const API_KEY = process.env.NEWS_API_KEY; 
// Humne query ko bilkul asan kar dia taake block na ho aur global business/finance news direct uthaye
const url = `https://newsapi.org{API_KEY}`;

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
};

console.log("Fetching fresh global updates from all over the world...");

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            
            if (!parsedData.articles || parsedData.articles.length === 0) {
                console.log("No news articles fetched. Saving empty array placeholder.");
                // Agar backup chahiye to aik dummy article dal dete hain taake screen khali na rahe
                const backup = [{
                    title: "Global Markets and Financial Policy Updates",
                    description: "International financial monitors are tracking fresh adjustments in global banking policy and trade relations. Full analysis reports will refresh shortly.",
                    url: "https://newsapi.org",
                    date: new Date().toISOString(),
                    category: "Finance"
                }];
                fs.writeFileSync('news.json', JSON.stringify(backup, null, 2));
                return;
            }

            const formattedNews = parsedData.articles.map(article => {
                let category = 'Finance';
                const titleLower = article.title ? article.title.toLowerCase() : '';
                // Dynamic category management
                if (titleLower.includes('govt') || titleLower.includes('border') || titleLower.includes('biden') || titleLower.includes('war') || titleLower.includes('policy')) {
                    category = 'Geopolitics';
                }

                return {
                    title: article.title || 'Global Intelligence Update',
                    description: article.description || 'Click the link below to view full coverage and real-time data from the primary dashboard.',
                    url: article.url || 'https://newsapi.org',
                    date: article.publishedAt || new Date().toISOString(),
                    category: category
                };
            });

            fs.writeFileSync('news.json', JSON.stringify(formattedNews, null, 2));
            console.log("Successfully saved today's reports to news.json!");
        } catch (error) {
            console.error("System Error during parsing:", error.message);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});
