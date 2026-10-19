@echo off
chcp 65001 >nul
echo تثبيت الحزم...
call npm install
echo بناء ملف التشغيل...
call npm run dist
echo تم. الملفات داخل مجلد dist
pause
