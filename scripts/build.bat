@echo off

SET "VERSION=$(cat src-tauri/tauri.conf.json | jq -r '.package.version')"

SET APPNAME_INSTALLER="ROM Hack Manager Installer.exe"
SET DIRPATH_INSTALLER=".\rom-hack-manager_%VERSION%_win_installer"

SET APPNAME_BUNDLE="ROM Hack Manager.exe"
SET DIRPATH_BUNDLE=".\rom-hack-manager_%VERSION%_win"

npm run tauri build

cd .\releases

IF EXIST %DIRPATH_INSTALLER% RMDIR /S /Q %DIRPATH_INSTALLER%
IF EXIST %DIRPATH_INSTALLER%.zip RMDIR /F %DIRPATH_INSTALLER%.zip

IF EXIST %DIRPATH_BUNDLE% RMDIR /S /Q %DIRPATH_BUNDLE%
IF EXIST %DIRPATH_BUNDLE%.zip RMDIR /F %DIRPATH_BUNDLE%.zip

MKDIR %DIRPATH_INSTALLER%\%APPNAME_INSTALLER%
XCOPY "..\src-tauri\target\release\bundle\nsis\ROM Hack Manager_%VERSION%_x64-setup.exe" %DIRPATH_INSTALLER%
XCOPY "..\docs\README.txt" %DIRPATH_INSTALLER%
XCOPY "..\docs\COMPATIBILITY.txt" %DIRPATH_INSTALLER%
XCOPY "..\CHANGELOG.txt" %DIRPATH_INSTALLER%
XCOPY "..\LICENSE.txt" %DIRPATH_INSTALLER%

MKDIR %DIRPATH_BUNDLE%\%APPNAME_BUNDLE%
XCOPY "..\src-tauri\target\release\ROM Hack Manager.exe" %DIRPATH_BUNDLE%
XCOPY "..\src-tauri\target\release\resources\flips.exe" %DIRPATH_BUNDLE%\resources
XCOPY "..\src-tauri\target\release\resources\flips-src.zip" %DIRPATH_BUNDLE%\resources
XCOPY "..\docs\README.txt" %DIRPATH_BUNDLE%
XCOPY "..\docs\COMPATIBILITY.txt" %DIRPATH_BUNDLE%
XCOPY "..\CHANGELOG.txt" %DIRPATH_BUNDLE%
XCOPY "..\LICENSE.txt" %DIRPATH_BUNDLE%
