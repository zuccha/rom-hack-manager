# Load version
$TAURI_CONFIG = Get-Content "src-tauri/tauri.conf.json" | ConvertFrom-Json
$VERSION = $TAURI_CONFIG.version

# Define variables
$DIRPATH_RELEASES = ".\releases"

$DIRPATH_INSTALLER = "${DIRPATH_RELEASES}\rom-hack-manager_${VERSION}_win_installer"
$ZIPPATH_INSTALLER = "${DIRPATH_INSTALLER}.zip"
$APPPATH_INSTALLER = "${DIRPATH_INSTALLER}\ROM Hack Manager Installer.exe"

$DIRPATH_BUNDLE = "${DIRPATH_RELEASES}\rom-hack-manager_${VERSION}_win"
$ZIPPATH_BUNDLE = "${DIRPATH_BUNDLE}.zip"
$APPPATH_BUNDLE = "${DIRPATH_BUNDLE}\ROM Hack Manager.exe"

# Run build
Invoke-Expression "npm run tauri build"

# Create releases directory if it doesn't exist
if (-not (Test-Path $DIRPATH_RELEASES)) {  New-Item -ItemType Directory -Path $DIRPATH_RELEASES }

# Remove old installer/bundle directories and zip files if they exist
if (Test-Path $DIRPATH_INSTALLER) { Remove-Item $DIRPATH_INSTALLER -Recurse -Force }
if (Test-Path $ZIPPATH_INSTALLER) { Remove-Item $ZIPPATH_INSTALLER -Force }

if (Test-Path $DIRPATH_BUNDLE) { Remove-Item $DIRPATH_BUNDLE -Recurse -Force }
if (Test-Path $ZIPPATH_BUNDLE) { Remove-Item $ZIPPATH_BUNDLE -Force }

# Create directories for the installer and bundle if they don't exist
New-Item -ItemType Directory -Path $DIRPATH_INSTALLER -Force
New-Item -ItemType Directory -Path $DIRPATH_BUNDLE -Force

# Copy files for the installer
Copy-Item ".\src-tauri\target\release\bundle\nsis\ROM Hack Manager_${VERSION}_x64-setup.exe" $APPPATH_INSTALLER -Force
Copy-Item ".\docs\README.txt" $DIRPATH_INSTALLER -Force
Copy-Item ".\CHANGELOG.txt" $DIRPATH_INSTALLER -Force
Copy-Item ".\LICENSE.txt" $DIRPATH_INSTALLER -Force

# Copy files for the bundle
New-Item -ItemType Directory -Path "${DIRPATH_BUNDLE}\resources"
Copy-Item ".\src-tauri\target\release\resources\flips.exe" "${DIRPATH_BUNDLE}\resources\flips.exe" -Force
Copy-Item ".\src-tauri\target\release\resources\flips-src.zip" "${DIRPATH_BUNDLE}\resources\flips-src.zip" -Force
Copy-Item ".\src-tauri\target\release\ROM Hack Manager.exe" $APPPATH_BUNDLE -Force
Copy-Item ".\docs\README.txt" $DIRPATH_BUNDLE -Force
Copy-Item ".\docs\COMPATIBILITY.txt" $DIRPATH_BUNDLE -Force
Copy-Item ".\CHANGELOG.txt" $DIRPATH_BUNDLE -Force
Copy-Item ".\LICENSE.txt" $DIRPATH_BUNDLE -Force

# Create archives
Compress-Archive -Path $DIRPATH_INSTALLER -DestinationPath $ZIPPATH_INSTALLER
Compress-Archive -Path $DIRPATH_BUNDLE -DestinationPath $ZIPPATH_BUNDLE
