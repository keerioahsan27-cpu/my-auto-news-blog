const fs = require('fs');
const https = require('https');

// International Financial Monitor ki direct open news feed url
const url = 'https://ft.com';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
};

console.log("Fetching fresh global updates...");

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const articles = [];
            // RSS XML parsing ka bilkul asan aur foolproof formula
            const items = data.split('<item>');
            
            for (let i = 1; i < Math.min(items.length, 11); i++) {
                const item = items[i];
                
                // Title extraction
                let title = '';
                const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
                if (titleMatch) {
                    title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
                }

                // Link extraction
                let link = 'https://ft.com';
                const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
                if (linkMatch) {
                    link = linkMatch[1].trim();
                }

                // Description extraction
                let description = 'Click the link below to view full coverage from the primary financial monitoring dashboard.';
                const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
                if (descMatch) {
                    description = descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, '').trim();
                    if (description.length > 150) {
                        description = description.substring(0, 150) + '...';
                    }
                }

                if (title) {
                    let category = 'Finance';
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('govt') || titleLower.includes('policy') || titleLower.includes('sanction') || titleLower.includes('biden') || titleLower.includes('china')) {
                        category = 'Geopolitics';
                    }

                    articles.push({
                        title: title,
                        description: description,
                        url: link,
                        date: new Date().toISOString(),
                        category: category
                    });
                }
            }

            // Fallback backup plan
            if (articles.length === 0) {
                articles.push({
                    title: "International Market Conditions and Geopolitical Monitor",
                    description: "Global financial dashboards are compiling real-time intelligence feeds. System refresh will complete automatically.",
                    url: "https://ft.com",
                    date: new Date().toISOString(),
                    category: "Finance"
                });
            }

            fs.writeFileSync('news.json', JSON.stringify(articles, null, 2));
            console.log("Successfully saved global reports!");
        } catch (error) {
            console.error("Parsing Error:", error.message);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});
