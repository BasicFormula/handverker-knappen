@echo off
echo Starting HåndverkerKnappen...

start "Backend" cmd /k "cd /d "%~dp0backend" && uvicorn main:app --reload"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "cd /d "%~dp0frontend" && yarn dev"

echo Both servers are starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
