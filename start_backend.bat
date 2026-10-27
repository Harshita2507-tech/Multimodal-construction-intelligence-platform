@echo off
echo ========================================================
echo Starting Multimodal Construction Intelligence API (FastAPI)
echo ========================================================
set PYTHONPATH=%~dp0
set PATH=%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;%PATH%
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
