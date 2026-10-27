@echo off
echo ========================================================
echo Starting Multimodal Construction Intelligence UI (React)
echo ========================================================
set PATH=%~dp0tools\nodejs;%PATH%
cd /d "%~dp0frontend"
call npm run dev
pause
