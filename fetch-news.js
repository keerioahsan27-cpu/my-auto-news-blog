const fs = require('fs');

// GitHub Secrets se API Key khud uthayega
const API_KEY = process.env.NEWS_API_KEY; 
const url = `https://newsapi.org(geopolitics OR finance OR economy)&language=en&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`;

async function getNews() {
    try {
        console.log("Fetching fresh global updates...");
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.articles || data.articles.length === 0) {
            console.log("No news articles fetched. Checking API limits.");
            return;
        }

        const formattedNews = data.articles.map(article => {
            // Category decide karne ka automated tareeqa
            let category = 'Geopolitics';
            const titleLower = article.title.toLowerCase();
            if (titleLower.includes('finance') || titleLower.includes('economy') || titleLower.includes('market') || titleLower.includes('stocks')) {
                category = 'Finance';
            }

            return {
                title: article.title,
                description: article.description,
                url: article.url,
                date: article.publishedAt,
                category: category
            };
        });

        // news.json file automatically ban jayegi aur save ho jayegi
        fs.writeFileSync('news.json', JSON.stringify(formattedNews, null, 2));
        console.log("Successfully saved today's reports to news.json!");
    } catch (error) {
        console.error("System Error during fetch:", error);
    }
}

getNews();
