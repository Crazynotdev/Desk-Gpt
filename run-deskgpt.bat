@echo off
setlocal

set "EXE_NAME=DeskGPT - Unleashed and Uncensored.exe"
set "SCRIPT_DIR=%~dp0"

set "EXE_PATH=%SCRIPT_DIR%dist\win-unpacked\%EXE_NAME%"
set "ALT_EXE_PATH=%SCRIPT_DIR%dist\%EXE_NAME%"
set "NEED_BUILD=1"

if exist "%EXE_PATH%" set "NEED_BUILD=0"
if "%NEED_BUILD%"=="1" if exist "%ALT_EXE_PATH%" (
  set "EXE_PATH=%ALT_EXE_PATH%"
  set "NEED_BUILD=0"
)

if "%NEED_BUILD%"=="0" (
  echo Existing build found:
  echo %EXE_PATH%
  echo 1^) Use existing
  echo 2^) Rebuild
  set /p buildchoice=Choice [1/2]:
  if "%buildchoice%"=="2" set "NEED_BUILD=1"
)

if "%NEED_BUILD%"=="1" (
  where npm >nul 2>&1
  if errorlevel 1 (
    echo npm not found. Install Node.js first.
    pause
    exit /b 1
  )

  if not exist "%SCRIPT_DIR%node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
      echo npm install failed.
      pause
      exit /b 1
    )
  )

  echo Building EXE ^(this can take a few minutes^)...
  call npm run dist
  if errorlevel 1 (
    echo Build failed.
    pause
    exit /b 1
  )

  set "EXE_PATH=%SCRIPT_DIR%dist\win-unpacked\%EXE_NAME%"
  if not exist "%EXE_PATH%" set "EXE_PATH=%SCRIPT_DIR%dist\%EXE_NAME%"
  if not exist "%EXE_PATH%" (
    echo Could not find "%EXE_NAME%" after build.
    pause
    exit /b 1
  )
)

echo Select hardware acceleration mode:
echo 1) Enable (default)
echo 2) Disable
set /p choice=Choice [1/2]:

if "%choice%"=="2" (
  set "DESKGPT_DISABLE_GPU=1"
) else (
  set "DESKGPT_DISABLE_GPU="
)

start "" "%EXE_PATH%"
