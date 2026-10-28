# Eco Pulse — Enterprise Transportation Carbon Intelligence Platform

Eco Pulse is an enterprise-grade transit emissions intelligence application providing real-time carbon tracking, commute calculations, district telemetry, and interactive transit community channels.

---

## 📁 Project Architecture & Modular Structure

The codebase is organized into dedicated directories for styles, scripts, and views while maintaining 100% full compatibility with modern static hosting environments (Render, GitHub Pages, Vercel, Netlify):

```text
Eco Pulse/
├── index.html               # Primary root entry point (Required by Render & GitHub Pages)
├── Eco Pulse.html           # Original filename alias preserved for direct bookmarks
├── .nojekyll                # Ensures static assets load directly without Jekyll interference
├── render.yaml              # Render blueprint deployment configuration
├── css/
│   └── style.css            # Custom CSS rules, typography, and scrollbar styling
├── js/
│   ├── app.js               # Application logic, calculation algorithms, and UI state
│   └── tailwind-config.js   # Tailwind custom theme colors, pulses, and animation tokens
└── html/
    └── index.html           # Modular view copy located in the dedicated HTML directory
```

---

## 🚀 Why "Not Found" (404) Occurred & How It Was Resolved

1. **Root Entry Point Requirement (`index.html`)**:
   - Both **GitHub Pages** and **Render Static Site** automatically look for `index.html` at the root of your repository to serve your homepage.
   - Previously, the file was named `Eco Pulse.html` (with a space and non-standard name). Because no `index.html` was found at the root, the servers responded with `404 Not Found`.
   - **Resolution**: We generated `index.html` at the project root while cleanly separating CSS and JS into `css/` and `js/` folders without touching or altering any part of the website interface or functionality.

2. **Jekyll Processing Interference**:
   - GitHub Pages by default processes repositories with Jekyll, which can ignore folders or throw 404s on certain static assets.
   - **Resolution**: Added `.nojekyll` to instruct GitHub Pages to serve static files directly.

---

## 🛠️ Step-by-Step Deployment Instructions

### Option 1: Deploying to GitHub Pages
1. Push all files and folders (`index.html`, `css/`, `js/`, `html/`, `.nojekyll`, etc.) to your GitHub repository on branch `main` (or `master`).
2. Go to your repository on GitHub.
3. Click on **Settings** (top tab) → **Pages** (in the left sidebar under *Code and automation*).
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` (or `master`), and set folder to `/ (root)`.
5. Click **Save**.
6. Wait 1-2 minutes. Your site will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

### Option 2: Deploying to Render (Static Site)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Static Site**.
3. Connect your GitHub repository (or upload repository).
4. Fill in the deployment settings:
   - **Name**: `eco-pulse` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: (Leave blank or `.`)
   - **Build Command**: (Leave blank)
   - **Publish Directory**: `.` (or `./`)
5. Click **Create Static Site**.
6. Render will automatically deploy your site using `index.html` and your custom domain/subdomain:
   `https://<your-app-name>.onrender.com`

---

## 💻 Local Testing
You can test the site locally with any static HTTP server:
```bash
# Using Python
python -m http.server 8080

# Or using Node
npx serve .
```
Then visit `http://localhost:8080/` in your browser.
