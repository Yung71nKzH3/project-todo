@echo off
title Lava Lamp Todo v2.0
echo Starting Lava Lamp Todo v2.0 Standalone App...
start /b npx vite preview --port 5174 --strictPort >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5174 --window-size=850,700
