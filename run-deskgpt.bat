@echo off
setlocal enabledelayedexpansion

REM Check if build exists
if exist "dist\win-unpacked\DeskGPT.exe" (
    echo Build found. Do you want to:
    echo 1. Use existing build
    echo 2. Rebuild
    echo.
    set /p choice="Enter your choice (1 or 2): "
    
    if "!choice!"=="1" (
        echo Launching DeskGPT...
        start "" "dist\win-unpacked\DeskGPT.exe"
        goto :eof
    )
)

echo Installing dependencies...
call npm install

echo Building renderer...
call npm run build:renderer

echo Building main process...
call npm run build:main

echo Building installer...
call npm run dist

echo Launching DeskGPT...
if exist "dist\win-unpacked\DeskGPT.exe" (
    start "" "dist\win-unpacked\DeskGPT.exe"
) else (
    echo Build failed or executable not found.
    pause
)