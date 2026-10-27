@echo off
echo =========================================================================
echo Launching Multimodal Construction Intelligence Platform (Full-Stack)
echo =========================================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Construction AI Backend" cmd /k "start_backend.bat"

echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "Construction AI Frontend" cmd /k "start_frontend.bat"

timeout /t 3 >nul
start http://localhost:5173
echo.
echo Platform successfully launched!
echo - Frontend UI: http://localhost:5173
echo - API & Swagger Docs: http://localhost:8000/docs
echo.
pause
