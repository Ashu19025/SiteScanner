# SiteScanner

🌐 SiteScanner

SiteScanner is a web scraping & analysis tool that extracts website metadata (brand name, description) and stores it in a PostgreSQL database. If no description is found, it auto-generates one using Google Gemini AI.

🚀 Features

Scrape website brand name & description.

AI-powered description generation (using Gemini API).

REST API (CRUD endpoints).

PostgreSQL database integration.

Fully deployed on Render.

🛠️ Tech Stack

Node.js + Express (Backend API)

PostgreSQL (Database – hosted on Supabase)

Cheerio + Axios (Web scraping)

Google Gemini API (AI-generated descriptions)

📦 Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/sitescanner.git
cd sitescanner

2. Install dependencies
npm install

3. Setup environment variables

Create a .env file in the root folder and add:

DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.dqqqniitiskpvnmpxphj
DB_PASS=Scraper@123
GEMINI_API_KEY=your-gemini-api-key
PORT=5000

4. Run the server
npm start


Server will start at 👉 http://localhost:5000

🔑 API Endpoints
POST /api/website

Analyze and save website info.

{
  "url": "https://microsoft.com"
}

GET /api/website

Fetch all scanned websites.

PUT /api/website/:id

Update website data.

{
  "brand_name": "Updated Brand",
  "description": "Updated description"
}

DELETE /api/website/:id

Delete a website by ID.

🌍 Deployment

The project is deployed on Render:
👉 https://sitescanner.onrender.com

🧪 Testing

You can test the API using:

Postman

cURL

Or directly from frontend integration.

Example using curl:

curl -X POST https://sitescanner.onrender.com/api/website \
-H "Content-Type: application/json" \
-d '{"url": "https://openai.com"}'

📜 License

MIT License – feel free to use & contribute!
