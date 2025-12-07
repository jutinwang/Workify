# Workify - Project Hand-off & Setup Guide

## 1. Project Overview
**Workify** is a full-stack web application designed to facilitate the co-op search process for students and employers, in a format applicable to any university.  

**Tech Stack:**
- **Frontend:** React (Vite), JavaScript/JSX
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

---

## 2. Prerequisites
Before running the project, ensure the following software is installed on your machine:

1.  **Node.js (LTS Version)**
    *   Download: [https://nodejs.org/](https://nodejs.org/)
    *   *Verify:* Run `node -v` in your terminal (should be v18 or higher).
2.  **PostgreSQL**
    *   Download: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
    *   *Important:* During installation, remember the **password** you set for the `postgres` user. You will need this later.
    *   *Verify:* Ensure the PostgreSQL service is running locally.
3.  **Git**
    *   Download: [https://git-scm.com/](https://git-scm.com/)
4.  **VS Code (Recommended)**
    *   Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 3. Repository Structure
The project is organized as follows:
*   **`/` (Root)** - Contains a master `package.json` that lets you run both frontend and backend with one command.
*   **`/backend`** - Contains the API, database schema, and server logic.
*   **`/workify`** - Contains the Frontend React user interface.

---

## 4. Quick Start (Recommended)
We have included a root script to make setup easier.

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd Workify
    ```

2.  **Setup Database**
    *   Follow **Step 2** in the "Manual Setup" section below to create the `workify` database.

3.  **Install All Dependencies:**
    Run this in the root `Workify` folder. This installs the "orchestrator" scripts and then automatically installs dependencies for both backend and frontend.
    ```bash
    npm install && npm run setup
    ```

4.  **Configure Environment Variables:**
    *   Follow **Step 3** and **Step 4** in the "Manual Setup" section below to create your `.env` files. This is still required!

5.  **Initialize Database:**
    ```bash
    npm run db:setup
    ```

6.  **Run Everything:**
    ```bash
    npm run dev
    ```
    *   This will start both the Backend (port 4000) and Frontend (port 5173) in a single terminal.

---

## 5. Manual Setup Guide (Detailed)

### Step 1: Clone the Repository
Open your terminal and run:
```bash
git clone <repository-url>
cd Workify
```

### Step 2: Database Setup
1.  Open your PostgreSQL tool (pgAdmin, TablePlus, or command line).
2.  Create a new, empty database named `workify`.
    *   *SQL Command:* `CREATE DATABASE workify;`

### Step 3: Backend Configuration
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables (CRITICAL STEP)**
    *   **Step 3a:** Inside the `backend` folder, create a **new file** and name it exactly `.env` (dot env).
        *   *Note:* If you don't see the file extension, just name it `.env`. It should not be `.env.txt`.
    *   **Step 3b:** Open this `.env` file and paste the following **EXACT** text:

    ```env
    DATABASE_URL="postgresql://YOUR_DB_USERNAME:YOUR_DB_PASSWORD@localhost:5432/workify?schema=public"
    JWT_SECRET="tolusecret123"
    PORT=4000
    HOST=0.0.0.0
    ```

    *   **Step 3c: EDIT THE DATABASE_URL**
        *   You **MUST** change `YOUR_DB_USERNAME` to your PostgreSQL username (default is often `postgres`).
        *   You **MUST** change `YOUR_DB_PASSWORD` to the password you created when installing PostgreSQL.
        *   **Example:** If your user is `postgres` and password is `password123`, the line looks like:
            `DATABASE_URL="postgresql://postgres:password123@localhost:5432/workify?schema=public"`

4.  **Initialize Database & Run Seed:**
    Run the following commands in order to create the tables and populate them with dummy data:
    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema to database
    npx prisma db push

    # Run the seed script (Populates DB with test users/jobs)
    npx prisma db seed
    ```

5.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    *   You should see: `Server running on port 4000` (or similar).
    *   *Keep this terminal window open.*

### Step 4: Frontend Configuration
1.  Open a **new** terminal window (do not close the backend).
2.  Navigate to the frontend folder:
    ```bash
    cd workify
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Configure Environment Variables:**
    *   Create a new file named `.env` inside the `workify` folder.
    *   Copy the following content into it:

    ```env
    # workify/.env

    VITE_API_URL=http://localhost:4000
    ```

5.  **Start the Frontend:**
    ```bash
    npm run dev
    ```
    *   You will see a local URL, usually `http://localhost:5173`.
    *   Cmd+Click (Mac) or Ctrl+Click (Windows) the link to open the app in your browser.

---

## 6. Verification & Login
Once both servers are running:
1.  Go to `http://localhost:5173`.
2.  Login using the credentials generated by the seed script.
    *   *Note:* Check `backend/prisma/seed.ts` to see the specific email/passwords created.
    *   **Common Test Student:** `student@uottawa.ca` / `password123` (Example - verify in seed file)
    *   **Common Test Employer:** `employer@company.com` / `password123` (Example - verify in seed file)

---

## 7. Troubleshooting

**Issue: "Connection refused" or Database errors**
*   Check your `.env` file in the `backend` folder.
*   Ensure your PostgreSQL password is correct.
*   Ensure the PostgreSQL service is actually running on your computer.

**Issue: "Prisma Client not initialized"**
*   Run `npx prisma generate` inside the `backend` folder again.

**Issue: Frontend cannot talk to Backend**
*   Ensure the Backend terminal is still running and hasn't crashed.
*   Ensure `VITE_API_URL` in `workify/.env` matches the port the backend is running on (default 4000).

---

## 8. Managing Data (The Easy Way)
If you want to view the users, jobs, or applications in the database without writing code, use **Prisma Studio**.

1.  Open a terminal in the `backend` folder.
2.  Run:
    ```bash
    npx prisma studio
    ```
3.  A browser window will open (usually at `http://localhost:5555`).
4.  You can now click on "User", "Job", etc., to see all the data rows, edit them, or delete them manually.

---

## 9. Command Cheat Sheet

| Action | Folder | Command |
| :--- | :--- | :--- |
| **Start Everything** | `/` (Root) | `npm run dev` |
| **Setup Everything** | `/` (Root) | `npm run setup` |
| **Reset Database** | `/` (Root) | `npm run db:setup` |
| **Start Backend Only** | `/backend` | `npm run dev` |
| **Start Frontend Only** | `/workify` | `npm run dev` |
| **View Database UI** | `/backend` | `npx prisma studio` |

---

## 10. Hosting & Deployment
If you wish to deploy this application for a live demo:

*   **Frontend (React):**
    *   Services like **Vercel**, **Netlify**, or **GitHub Pages** are easiest.
    *   *Note:* You will need to configure the build settings to point to the `workify` folder.
*   **Backend (Node/Express):**
    *   Services like **Render**, **Railway**, or **Heroku** are recommended.
    *   They can auto-detect the Node.js app in the `backend` folder.
*   **Database (PostgreSQL):**
    *   **Neon.tech**, **Supabase**, or **Railway** provide free managed PostgreSQL databases.
    *   Simply replace the `DATABASE_URL` in your production `.env` with the connection string they provide.

---

## 11. Closing Note
Thank you for the opportunity to work on Workify! We have built a robust foundation for the student/employer co-op experience, including real-time stats, profile management, and a comprehensive admin dashboard.

We look forward to seeing the future of Workify and how it will continue to help students and employers connect.

**Best regards,**
**The Workify Dev Team (Tolu Emoruwa, Justin Wang, Ali Bhangu)**

