@echo off
echo Stopping NextHire Project...
call "C:\Users\HP\AppData\Roaming\npm\pm2.cmd" stop all
echo Done. All services stopped.
pause
