# finance_tracker

Getting Started
Follow these steps to run the project locally.

Prerequisites
Node.js & npm
≥ v16.x (includes npm) — https://nodejs.org/

MongoDB

Community Edition running on localhost:27017, or

Atlas connection string

Git
≥ 2.x — https://git‑scm.com/downloads

1. Clone the Repository
bash
Copy
Edit
# Replace with your repo URL
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
cd <YOUR_REPO>
This directory is your project root (it contains package.json, server/, client/, etc.).

2. Configure Environment Variables
In the project root, create a file named .env:

ini
Copy
Edit
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/Personal_financial_tracking

# JSON Web Token
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=2h
Security: Add .env to your .gitignore so you don’t commit secrets.

3. Install Dependencies
a) Server (project root)
bash
Copy
Edit
npm install
This will install backend libraries, including:

express, mongoose, dotenv, jsonwebtoken

multer (file uploads)

pdf-parse (PDF text extraction)

tesseract.js (OCR for images)

cors, nodemon (dev)

b) Client (React app)
bash
Copy
Edit
cd client
npm install
Installs frontend libraries, including:

react, react-dom, react-router-dom

axios (HTTP)

recharts (charts)

concurrently (if you added a root dev script)

4. Run the Application
You can start the backend and frontend separately, or together:

Separate terminals
In terminal 1 (project root):

bash
Copy
Edit
npm run server
# — or node server.js / nodemon server.js
In terminal 2 (inside client/):

bash
Copy
Edit
npm start
# — runs react-scripts start on port 3000
Single command (optional)
If you’ve added [concurrently] and a "dev" script in your root package.json:

bash
Copy
Edit
npm run dev
5. Verify
Visit http://localhost:3000 in your browser.

Register or log in.

Navigate to Transactions; test uploading a PDF or image.

Check Dashboard and Reports for charts and tables.
