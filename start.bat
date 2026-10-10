@echo off
chcp 65001 >nul
title NBA 数据馆
set URL=http://127.0.0.1:8123/xuyz-nba

rem 服务器已在运行 → 直接打开浏览器
curl -s -o nul --max-time 2 "%URL%"
if %errorlevel%==0 (
  start "" "%URL%"
  exit /b
)

rem 未运行 → 后台静默启动服务器,再打开浏览器
powershell -NoProfile -Command "Start-Process node -ArgumentList 'server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
timeout /t 3 /nobreak >nul
start "" "%URL%"
