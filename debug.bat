@echo off
echo ========================================
echo   Luo Desktop - Debug Mode
echo ========================================
echo.

REM Check Node.js
echo [1] Checking Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo [OK] Node.js installed
echo.

REM Install express
echo [2] Installing Express...
call npm install express 2>&1
echo.

REM Try starting server
echo [3] Starting server...
echo.
echo ========================================
echo If you see "Luo Desktop" below, it worked!
echo If you see errors, tell Wayne!
echo ========================================
echo.

node src\index.js 2>&1

echo.
echo Server stopped. Press any key to exit...
pause
