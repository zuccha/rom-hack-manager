VERSION=$(cat src-tauri/tauri.conf.json | jq -r '.version')
APPNAME="ROM Hack Manager.app"
DIRPATH="./rom-hack-manager_${VERSION}_macos"

npm run tauri build -- --target=universal-apple-darwin

mkdir -p "./releases"
cd "./releases"

if [ -d $DIRPATH ]; then rm -rf $DIRPATH; fi
if [ -f "${DIRPATH}.zip" ]; then rm "${DIRPATH}.zip"; fi

mkdir -p "${DIRPATH}/${APPNAME}"
cp -r "../src-tauri/target/universal-apple-darwin/release/bundle/macos/${APPNAME}" "${DIRPATH}"

rm "$DIRPATH/$APPNAME/Contents/Resources/resources/flips.exe"
cp "../docs/README.txt" "$DIRPATH/README.txt"
cp "../CHANGELOG.txt" "$DIRPATH/CHANGELOG.txt"
cp "../LICENSE.txt" "$DIRPATH/LICENSE.txt"

zip -rq "${DIRPATH}.zip" "$DIRPATH"
