@echo off
echo ===================================================
echo   REVERT OKO WEBSITE ON VPS TO PREVIOUS VERSION
echo ===================================================
echo.
echo WARNING: This will immediately replace the live website with the 
echo exact backup version from right before the latest carousel update.
echo.
echo Press any key to confirm and revert, or close this window to cancel...
pause >nul

echo.
echo Restoring backup on VPS (31.128.41.93)...
ssh -i "c:\Users\Sanjay\.ssh\vps_begit" root@31.128.41.93 "rm -rf /var/www/oko_newest && mv /var/www/oko /var/www/oko_newest && cp -r /var/www/oko_backup_2026_04_24 /var/www/oko"

echo.
echo ===================================================
echo   DONE! The website has been successfully reverted.
echo ===================================================
pause
