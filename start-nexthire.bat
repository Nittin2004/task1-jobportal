@echo off
echo Starting NextHire Project...
cd /d "C:\Users\HP\OneDrive\Desktop\Task"
call "C:\Users\HP\AppData\Roaming\npm\pm2.cmd" start ecosystem.config.cjs
echo NextHire is now running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
pause
