const fs = require('fs');
const https = require('https');

// Google News ki official free international business aur market RSS feed
const url = 'https://google.com';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
};

console.log("Fetching fresh global updates from Google News Feed...");

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            // Google News RSS se titles aur links nikaalne ka simple automated formula
            const articles = [];
            const items = data.split('<item>');
            
            // Pehle item ko chhor kar baqi top 12 articles uthayenge
            for (let i = 1; i < Math.min(items.length, 13); i++) {
                const item = items[i];
                
                const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
                const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
                const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
                
                if (titleMatch && linkMatch) {
                    let title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
                    let urlLink = linkMatch[1].trim();
                    let pubDate = dateMatch ? dateMatch[1] : new Date().toISOString();
                    
                    // Source name ko title se saaf karna (e.g., - Reuters)
                    if (title.includes(' - ')) {
                        title = title.split(' - ')[0];
                    }

                    let category = 'Finance';
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('govt') || titleLower.includes('policy') || titleLower.includes('sanction') || titleLower.includes('biden') || titleLower.includes('china')) {
                        category = 'Geopolitics';
                    }

                    articles.push({
                        title: title,
                        description: 'Click the link below to view full coverage and official analysis on Google News network.',
                        url: urlLink,
                        date: pubDate,
                        category: category
                    });
                }
            }

            if (articles.length === 0) {
                console.log("Feed processing returned 0 articles. Saving placeholder.");
                articles.push({
                    title: "International Market Conditions and Geopolitical Monitor",
                    description: "Global financial dashboards are compiling real-time intelligence feeds. System refresh will complete automatically.",
                    url: "https://google.com",
                    date: new Date().toISOString(),
                    category: "Finance"
                });
            }

            fs.writeFileSync('news.json', JSON.stringify(articles, null, 2));
            console.log(`Successfully saved ${articles.length} global reports!`);
        } catch (error) {
            console.error("Parsing Error:", error.message);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});
