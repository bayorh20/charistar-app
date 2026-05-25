@echo off
cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install from: https://git-scm.com/download/win
  echo Or install GitHub Desktop: https://desktop.github.com/
  pause
  exit /b 1
)

if not exist .git (
  git init
  git branch -M main
)

git add .
git commit -m "Charistar: premium yogurt ecommerce web app with Vercel config" 2>nul
if errorlevel 1 (
  echo Nothing new to commit, or commit failed.
)

where gh >nul 2>&1
if not errorlevel 1 (
  echo Creating GitHub repo and pushing with GitHub CLI...
  gh repo create charistar-app --public --source=. --remote=origin --push
  if not errorlevel 1 goto done
)

echo.
echo If gh failed, create a repo at https://github.com/new then run:
echo   git remote add origin https://github.com/bayorh20/charistar-app.git
echo   git push -u origin main
echo.
set /p REPO_URL="Paste your repo URL (or press Enter to skip): "
if not "%REPO_URL%"=="" (
  git remote remove origin 2>nul
  git remote add origin %REPO_URL%
  git push -u origin main
)

:done
echo.
echo Done. Import the repo on https://vercel.com/new to go live.
pause
