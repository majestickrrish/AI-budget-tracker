# AI Budget Tracker

Welcome to the AI Budget Tracker! This project uses a separated frontend (React + Vite) and backend (Node + Express + MongoDB) architecture.

## Getting Started

Because `node_modules` and `.env` files are ignored by Git for security and size reasons, **you must recreate the local environment on your machine after pulling the repository.**

Follow these exact steps to run the stack on your machine:

### 1. Clone the repo
```bash
git clone <repo-url>
cd ai-budget-tracker
```

### 2. Install Dependencies (Mandatory)
You must install dependencies for both the frontend and the backend separately. If you skip this, the project will not run.

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Create your `.env` File (Critical)
Environment variables securely store passwords, URIs, and ports. Git ignores this file, so you must create it manually.

Create a file exactly named `.env` inside the `server/` directory (`ai-budget-tracker/server/.env`) and add these values:

```env
MONGO_URI=your_shared_mongodb_connection_string
PORT=5000
JWT_SECRET=anything_random_string
```
*(Ask your teammate for the correct `MONGO_URI` so both of you are connecting to the same shared MongoDB Atlas database!).*

### 4. Run Both Apps
You will need two separate terminal windows open in VS Code to run both servers concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 5. Verify Everything is Working
Open your browser to the URL Vite gives you (usually `http://localhost:5173/`) and click the **"Test Backend"** button. If the UI says the API is working and fetching from MongoDB, your full-stack setup is completely working on your laptop!

