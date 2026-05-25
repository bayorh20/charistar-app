# Charistar — Web App

Premium yogurt ecommerce web app for healthy snacks and delivery.

## Live demo

Deploy to Vercel (see below) or run locally.

## Local development

```bash
cd charistar-app
npm install
npm run open
```

Open **http://localhost:4000**

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import **bayorh20/charistar-app**
4. Confirm project settings (must match exactly):
   - **Root Directory:** leave empty (`.`)
   - **Build command:** `npm run build:web`
   - **Output directory:** `dist`
   - **Framework Preset:** Other
5. Click **Deploy**

If you see `404: NOT_FOUND`, open Project Settings → General → Root Directory (should be blank) and Build & Development → Output Directory = `dist`, then redeploy.

Or with CLI:

```bash
npx vercel --prod
```

## Push to GitHub

```bash
cd charistar-app
git init
git add .
git commit -m "Initial commit: Charistar premium yogurt ecommerce web app"
gh repo create charistar-app --public --source=. --push
```

Without GitHub CLI, create a repo on github.com, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/charistar-app.git
git branch -M main
git push -u origin main
```

## Demo credentials

- Login: any phone + any 4-digit OTP
- Guest login available
- Promo codes: `FRESH10`, `CAMPUS15`, `CHARISTAR`

## Tech

Expo 56 · React Native Web · Expo Router · Zustand · Reanimated
