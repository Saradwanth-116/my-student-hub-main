# StudentHub Local Setup Guide

This guide will help you set up and run the StudentHub project on your local machine.

## 📌 Project Overview
StudentHub is a full-stack application consisting of:
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, and shadcn-ui.
- **Backend**: Python, FastAPI, and Supabase for database and authentication.
- **Tools**: Ngrok for exposing the backend (optional, configured in the start script).

---

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed on your system:
1. [Node.js](https://nodejs.org/) (v18+ recommended) & npm.
2. [Python](https://www.python.org/downloads/) (v3.8+ recommended).
3. A [Supabase](https://supabase.com/) account and a configured project.
4. (Optional) [Ngrok](https://ngrok.com/) if you want to expose your backend publicly using the provided `start_dev.bat` script.

---

## ⚙️ 1. Environment Configuration

### Frontend
1. In the root directory, create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and update the variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Project Anon Key.
   - `VITE_API_BASE_URL`: **Change this to `http://localhost:8001`** (the provided `start_dev.bat` runs the backend on port 8001, so this needs to match).

### Backend
1. Check the `backend` folder for a `.env` file. 
2. Ensure it contains the necessary Supabase credentials (typically `SUPABASE_URL` and `SUPABASE_KEY`) required by `supabase_client.py`.

---

## 💻 2. Frontend Setup
Open your terminal in the root directory (`my-student-hub-main`) and install the Node dependencies:
```bash
npm install
```

---

## 🐍 3. Backend Setup
1. Open a new terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`
4. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 4. Running the Application

### Option A: Using the provided batch script (Windows only)
The project includes a convenient `start_dev.bat` script that starts everything at once.
Simply double-click `start_dev.bat` in the root folder, or run it from the command prompt:
```cmd
start_dev.bat
```
*This will open separate command windows for:*
- Frontend server (Vite)
- Backend server (FastAPI running on port 8001)
- Ngrok tunnel (tunnels port 8001)

### Option B: Running Manually
If you prefer to start the services manually or are on Mac/Linux:

**Start the Backend:**
```bash
cd backend
# Activate venv if not already active
venv\Scripts\activate  # (Windows)
# source venv/bin/activate # (Mac/Linux)
uvicorn main:app --reload --port 8001
```

**Start the Frontend:**
Open a new terminal in the root directory and run:
```bash
npm run dev
```

---

## 🌟 Accessing the App
- **Frontend**: Navigate to `http://localhost:5173` (or the URL Vite provides in the console).
- **Backend API**: Navigate to `http://localhost:8001/docs` to see the auto-generated Swagger UI for your FastAPI endpoints.
