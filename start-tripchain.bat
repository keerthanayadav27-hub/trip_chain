@echo off
title TripChain - Collaborative AI Itineraries on Blockchain
echo ======================================================================
echo           TripChain - Web3 AI Travel Consensus Platform
echo ======================================================================
set PATH=C:\Users\nsanj\AppData\Local\Programs\nodejs;%PATH%
cd /d "%~dp0"
echo Opening browser at http://localhost:5173 ...
start http://localhost:5173
echo Running Vite Development Server...
npm run dev -- --host --port 5173
pause
