@echo off
echo.
echo ========================================
echo   Luo Desktop - Starting...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Install express if needed
if not exist "node_modules\express" (
    echo Installing dependencies...
    call npm install express
    echo.
)

echo Starting Luo Desktop...
echo.
echo If browser doesn't open, go to: http://localhost:3000/desktop
echo.

REM Start server and open browser
start http://localhost:3000/desktop
node src\index.js

pause
