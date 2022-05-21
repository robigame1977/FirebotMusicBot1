@echo off
title Update Github Files
:wybor
echo Choose action:
echo.
echo [1] Update Github Files
echo [2] Exit
set /p Choose:={1;2}:
if %Choose:%==1 goto update
if %Choose:%==2 goto exit

:exit
exit

:update
echo Getting files Ready...
git add .
echo Pulling git..
git pull
echo Pushing master/main...
git push public master
git push public main
echo Pulling master/main... 
git pull public master
git pull public main
echo Update Ready!
echo Press any key 2 times to close program.
pause >nul
echo Press any key 1 times to close
pause>nul
exit