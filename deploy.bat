@echo off
echo ZIVAH International Deployment
echo ==============================

echo Cleaning local build cache...
if exist .next rmdir /s /q .next

echo Building in production mode...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed with error level %errorlevel%
    pause
    exit /b %errorlevel%
)

echo Creating deploy folder...
if exist deploy rmdir /s /q deploy
mkdir deploy

echo Copying files for Standalone Mode...
REM Standalone app goes to root of deploy, but .next/static and public must be nested
xcopy .next\standalone\* deploy\ /e /i /h /y

REM The critical part: Standalone needs static and public folders INSIDE the standalone directory
mkdir deploy\.next\static
xcopy .next\static\* deploy\.next\static\ /e /i /h /y
REM Include full server chunks to avoid missing SSR runtime chunks in Turbopack builds
mkdir deploy\.next\server\chunks
xcopy .next\server\chunks\* deploy\.next\server\chunks\ /e /i /h /y
mkdir deploy\public
xcopy public\* deploy\public\ /e /i /h /y

REM Create a clean package.json for production deployment
node -e "const fs = require('fs'); const pkg = require('./package.json'); delete pkg.devDependencies; delete pkg['lint-staged']; pkg.scripts = { start: 'node server.js' }; fs.writeFileSync('deploy/package.json', JSON.stringify(pkg, null, 2));"
copy package-lock.json deploy\package-lock.json /y 2>nul
copy .npmrc deploy\.npmrc /y 2>nul

REM Copy prisma schema (needed for Prisma client)
mkdir deploy\prisma
copy prisma\schema.prisma deploy\prisma\schema.prisma /y

REM Copy generated prisma client
if exist generated\prisma (
    mkdir deploy\generated\prisma
    xcopy generated\prisma deploy\generated\prisma\ /e /i /h /y
)

REM Copy helpers
REM .env configured manually on server
REM database scripts not present

echo Creating ZIP...
powershell "Compress-Archive -Path deploy\* -DestinationPath zivah-deploy.zip -Force"

echo Ready for upload!
echo.
echo Auto-uploading via FTP to ftp.zivahinternational.com...

REM Load environment variables from .env.production file
if exist .env.production (
    for /f "usebackq tokens=1,2 delims==" %%a in (.env.production) do (
        if "%%a"=="FTP_HOST" set FTP_HOST=%%b
        if "%%a"=="FTP_USER" set FTP_USER=%%b
        if "%%a"=="FTP_PASSWORD" set FTP_PASSWORD=%%b
        if "%%a"=="FTP_PATH" set FTP_PATH=%%b
    )
)

REM Set defaults if not found in .env
if not defined FTP_HOST set FTP_HOST=ftp.zivahinternational.com
if not defined FTP_USER set FTP_USER=zivahint
if not defined FTP_PATH set FTP_PATH=/public_html/nextjs

REM Check if FTP password is available
if not defined FTP_PASSWORD (
    echo FTP_PASSWORD not found in .env.production file
    echo Please add FTP_PASSWORD=your-password to your .env.production file
    pause
    goto :end
)

echo Uploading to %FTP_HOST% as %FTP_USER%...
powershell -Command "$ftp='%FTP_HOST%'; $user='%FTP_USER%'; $pass='%FTP_PASSWORD%'; $path='%FTP_PATH%'; try { $req=[System.Net.FtpWebRequest]::Create(\"ftp://$ftp$path/zivah-deploy.zip\"); $req.Method=[System.Net.WebRequestMethods+Ftp]::UploadFile; $req.Credentials=New-Object System.Net.NetworkCredential($user,$pass); $req.UseBinary=$true; $req.UsePassive=$true; $data=[System.IO.File]::ReadAllBytes('zivah-deploy.zip'); $req.ContentLength=$data.Length; $stream=$req.GetRequestStream(); $stream.Write($data,0,$data.Length); $stream.Close(); $resp=$req.GetResponse(); $resp.Close(); Write-Host 'Upload successful! Extract in cPanel File Manager.'; } catch { Write-Host 'Upload failed:' $_.Exception.Message; exit 1; }"

if %errorlevel% equ 0 (
    echo Upload completed successfully!
) else (
    echo Upload failed!
    pause
)

:end
