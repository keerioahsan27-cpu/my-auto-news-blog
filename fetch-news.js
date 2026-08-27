const fs = require('fs');
const https = require('https');

const url = 'https://ft.com';
const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };

console.log("Generating Premium Live HTML Website...");

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            let newsHTML = '';
            const items = data.split('<item>');
            
            for (let i = 1; i < Math.min(items.length, 11); i++) {
                const item = items[i];
                let title = 'Global Financial Update';
                const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
                if (titleMatch) title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();

                let link = 'https://ft.com';
                const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
                if (linkMatch) link = linkMatch[1].trim();

                let description = 'Click below to read full coverage from the primary dashboard.';
                const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
                if (descMatch) description = descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, '').substring(0, 150).trim() + '...';

                let category = 'Finance';
                if (title.toLowerCase().includes('govt') || title.toLowerCase().includes('policy') || title.toLowerCase().includes('war')) {
                    category = 'Geopolitics';
                }

                newsHTML += `
                    <div class="card">
                        <div class="meta">${category} | LIVE UPDATE</div>
                        <h2>${title}</h2>
                        <p>${description}</p>
                        <a href="${link}" target="_blank">Read Original Report →</a>
                    </div>
                `;
            }

            // Agar koi news na mile toh backup dabba
            if (newsHTML === '') {
                newsHTML = `
                    <div class="card">
                        <div class="meta">Finance | System Notice</div>
                        <h2>International Market Conditions Monitor</h2>
                        <p>Global financial dashboards are compiling real-time intelligence feeds. System refresh will complete automatically.</p>
                        <a href="https://ft.com" target="_blank">View Dashboard →</a>
                    </div>
                `;
            }

            // Poori Website ka HTML code jo robot khud likhega
            const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Global Monitor | Finance & Geopolitics</title>
    <style>
        body { font-family: 'Georgia', serif; background-color: #fcfbf7; color: #111; margin: 0; padding: 20px; }
        header { text-align: center; border-bottom: 4px double #0f1c3f; padding-bottom: 15px; margin-bottom: 30px; }
        header h1 { font-size: 3rem; margin: 0; color: #0f1c3f; letter-spacing: 2px; font-weight: 900; }
        header p { font-style: italic; color: #555; margin: 5px 0 0 0; font-size: 1.1rem; }
        .main-container { display: grid; grid-template-columns: 3fr 1fr; gap: 40px; max-width: 1300px; margin: 0 auto; }
        .news-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        @media (max-width: 900px) { .main-container { grid-template-columns: 1fr; } .news-grid { grid-template-columns: 1fr; } }
        .card { background: white; padding: 25px; border: 1px solid #e2e0d9; box-shadow: 0 4px 6px rgba(0,0,0,0.01); border-top: 3px solid #0f1c3f; }
        .card h2 { font-size: 1.5rem; margin-top: 0; color: #0f1c3f; line-height: 1.3; }
        .card .meta { font-size: 0.8rem; color: #b58900; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; font-family: Arial, sans-serif; letter-spacing: 1px; }
        .card p { font-family: 'Arial', sans-serif; font-size: 0.95rem; line-height: 1.6; color: #333; }
        .card a { color: #0f1c3f; font-weight: bold; text-decoration: none; font-family: Arial, sans-serif; font-size: 0.9rem; border-bottom: 1px solid #0f1c3f; }
        .sidebar { background: #f4f6f9; padding: 25px; border-top: 4px solid #c0392b; height: fit-content; position: sticky; top: 20px; }
        .sidebar h3 { margin-top: 0; color: #c0392b; font-size: 1.1rem; text-transform: uppercase; font-family: Arial, sans-serif; letter-spacing: 1px; }
        .sidebar p { font-family: Arial, sans-serif; font-size: 0.85rem; line-height: 1.6; color: #444; margin-bottom: 15px; }
    </style>
</head>
<body>
    <header>
        <h1>THE GLOBAL MONITOR</h1>
        <p>Automated Geopolitics & Financial Intelligence — Updated Daily</p>
    </header>
    <div class="main-container">
        <div class="news-grid">${newsHTML}</div>
        <div class="sidebar">
            <h3>⚠️ AI Notice & Legal Disclaimer</h3>
            <p><strong>Automated Content Notice:</strong> All news, data, summaries, and publications displayed on this platform are automatically aggregated, processed, and published using advanced AI automation and internet data pipelines.</p>
            <p>The website owner does not manually review, verify, edit, or endorse any of the information posted herein. In the event of errors, inaccuracies, misinformation, or potential copyright concerns, the website owner assumes zero legal liability and holds absolute exemption from any responsibility.</p>
            <p>Readers and users are advised to verify data independently and utilize this content entirely at their own discretion and risk.</p>
        </div>
    </div>
</body>
</html>`;

            fs.writeFileSync('index.html', fullPage);
            console.log("Successfully generated brand new index.html with live news!");
        } catch (error) {
            console.error("Parsing Error:", error.message);
        }
    });
});
