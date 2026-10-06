@echo off
title Push TripChain to GitHub
echo ======================================================================
echo    Pushing TripChain to GitHub Repository:
echo    https://github.com/antigravity257y1a6648/trip_chain
echo ======================================================================
set PATH=C:\Users\nsanj\AppData\Local\Programs\git\cmd;C:\Users\nsanj\AppData\Local\Programs\bin;%PATH%
cd /d "%~dp0"
echo Running git push...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo  SUCCESS! Your code has been pushed to GitHub.
    echo  Now go to https://vercel.com/new to deploy!
    echo ======================================================================
) else (
    echo.
    echo If prompted, sign in with your GitHub account in the pop-up window or enter your Personal Access Token.
)
pause
