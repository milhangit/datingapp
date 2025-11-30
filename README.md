# Spark - Premium Dating App

A next-generation, mobile-first dating application built for the modern web.

![Spark App](/client/public/vite.svg)

## 🚀 Tech Stack

-   **Frontend**: Preact, Vite, Tailwind CSS v4, Framer Motion
-   **Backend**: Cloudflare Pages Functions, Cloudflare Workers
-   **Database**: Cloudflare D1 (SQLite)
-   **CMS**: TinaCMS (Git-backed content management)
-   **Auth**: Custom Phone OTP (JWT via HttpOnly Cookies)

## ✨ Features

-   **Swipe UI**: Smooth, native-feeling card stack with gesture support.
-   **Real-time Matching**: Instant feedback and celebration modals.
-   **Dark Mode**: Beautifully crafted dark theme.
-   **Secure**: Phone-based authentication to reduce bots.
-   **Fast**: Edge-deployed for global low latency.

## 🛠️ Local Development

1.  **Install Dependencies**
    ```bash
    npm install
    cd client && npm install
    ```

2.  **Setup Database**
    ```bash
    # Create D1 Database (if not exists)
    npx wrangler d1 create dating-app-db

    # Apply Migrations
    npm run db:migrate
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:5173` to see the app.

## 📦 Deployment

This project is configured for **Cloudflare Pages**.

1.  **Push to GitHub**: The repo is set up for auto-deployment.
    ```bash
    git push origin main
    ```

2.  **Manual Deploy**:
    ```bash
    npm run deploy
    ```

## 📂 Project Structure

-   `/client`: Frontend application (Preact + Vite).
-   `/functions`: Backend API routes (Cloudflare Pages Functions).
-   `/migrations`: D1 Database schema changes.
-   `/tina`: CMS configuration.

## 📄 License

MIT
