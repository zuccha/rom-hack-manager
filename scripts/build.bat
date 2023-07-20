@echo off

if "%~1"=="" (
  ECHO No version provided
  exit 1
)

SET VERSION=%1

SET APPNAME_INSTALLER="ROM Hack Manager Installer.exe"
SET DIRPATH_INSTALLER=".\rom-hack-manager_%VERSION%_win_installer"

SET APPNAME_BUNDLE="ROM Hack Manager.exe"
SET DIRPATH_BUNDLE=".\rom-hack-manager_%VERSION%_win"

call npm run tauri build

if NOT EXIST .\releases MKDIR .\releases
cd .\releases

if EXIST %DIRPATH_INSTALLER% RMDIR /S /Q %DIRPATH_INSTALLER%
if EXIST %DIRPATH_INSTALLER%.zip RMDIR /F %DIRPATH_INSTALLER%.zip

if EXIST %DIRPATH_BUNDLE% RMDIR /S /Q %DIRPATH_BUNDLE%
if EXIST %DIRPATH_BUNDLE%.zip RMDIR /F %DIRPATH_BUNDLE%.zip

echo F | XCOPY "..\src-tauri\target\release\bundle\nsis\ROM Hack Manager_%VERSION%_x64-setup.exe" %DIRPATH_INSTALLER%\%APPNAME_INSTALLER%
XCOPY /q /y "..\docs\README.txt" %DIRPATH_INSTALLER%
XCOPY /q /y "..\docs\COMPATIBILITY.txt" %DIRPATH_INSTALLER%
XCOPY /q /y "..\CHANGELOG.txt" %DIRPATH_INSTALLER%
XCOPY /q /y "..\LICENSE.txt" %DIRPATH_INSTALLER%

echo F | XCOPY "..\src-tauri\target\release\ROM Hack Manager.exe" %DIRPATH_BUNDLE%\%APPNAME_BUNDLE%
echo D | XCOPY "..\src-tauri\target\release\resources\flips.exe" %DIRPATH_BUNDLE%\resources
echo D | XCOPY "..\src-tauri\target\release\resources\flips-src.zip" %DIRPATH_BUNDLE%\resources
XCOPY /q /y "..\docs\README.txt" %DIRPATH_BUNDLE%
XCOPY /q /y "..\docs\COMPATIBILITY.txt" %DIRPATH_BUNDLE%
XCOPY /q /y "..\CHANGELOG.txt" %DIRPATH_BUNDLE%
XCOPY /q /y "..\LICENSE.txt" %DIRPATH_BUNDLE%
