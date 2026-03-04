@echo off
echo.
echo ========================================
echo   Luo Desktop - Simple Python Version
echo ========================================
echo.

REM Check for Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python found!
    echo.
    echo Starting Luo Desktop on port 8000...
    echo.
    echo Opening browser...
    start http://localhost:8000/desktop
    python -m http.server 8000
    goto :end
)

REM Try python3
python3 --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python3 found!
    echo.
    echo Starting Luo Desktop on port 8000...
    echo.
    echo Opening browser...
    start http://localhost:8000/desktop
    python3 -m http.server 8000
    goto :end
)

echo ERROR: Python not found!
echo.
echo Try installing Python from:
echo https://www.python.org/downloads/
echo.
pause

:end
