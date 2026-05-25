@echo off
cd /d "%~dp0"
echo Building Charistar web app...
call npm run build:web
if errorlevel 1 exit /b 1
echo.
echo Starting server at http://localhost:4000
echo Press Ctrl+C to stop.
call node scripts\serve.js
