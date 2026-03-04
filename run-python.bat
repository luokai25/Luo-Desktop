@echo off
echo Starting Luo Desktop with Python...
echo.

REM Check for Python 3
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python not found! Trying Python 2...
    where python2 >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Python is not installed!
        echo.
        echo Install Python from: https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

echo Starting Luo Desktop...
echo.
echo Open your browser to: http://localhost:8000/desktop
echo.
echo Press CTRL+C to stop the server
echo.

REM Start Python HTTP server
python -m http.server 8000

pause
