# ROM Hack Manager

Download, unzip, and patch ROM hacks all in one go. Manage hacks for your SNES
games.

For bug reports, support, and feature requests you can submit an issue here, or
[join the Discord server](https://discord.gg/w6pxTbgD)!

<img src="./docs/images/rom_hack_manager.png" alt="ROM Hack Manager" width="400px" max-width="100%" style="border: 1px solid black; border-radius: 10px;" />

## Table of Contents

1. [Downloads](#downloads)
2. [Features](#features)
3. [Guide](#guide)
4. [Credits](#credits)
5. [License](#license)
6. [Compatibility](#compatibility)
7. [Run locally](#run-locally)

## Downloads

| OS          | Version       | Architecture Link    | Link                                                                                                                    |
| ----------- | ------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Windows** | 7 or newer    | x86, 64-bit          | [Download](https://github.com/zuccha/rom-hack-manager/releases/download/2.4.0/rom-hack-manager_2.4.0_win_installer.zip) |
| **macOS**   | 10.3 or newer | Intel, Apple Silicon | [Download](https://github.com/zuccha/rom-hack-manager/releases/download/2.4.0/rom-hack-manager_2.4.0_macos.zip)         |

**N.B.: Since I'm not a certified developer, both Windows and macOS will warn
you the first time you try to open the application.**

- On **Windows** you can select _More Info_ and _Run Anyway_ on the warning
  message.
- **macOS** will tell you the app is broken (or something along those lines). To
  use the tool, you have to disable _Gatekeeper_:

  1. Open the _Terminal_ app
  2. Type `xattr -cr "/path/to/ROM Hack Manager.app"` and hit _Enter_
  3. Open the app again

  You can find a better explanation on
  [this website](https://osxdaily.com/2019/02/13/fix-app-damaged-cant-be-opened-trash-error-mac)

Do this only if you trust me :)

## Features

With _ROM Hack Manager_ you can:

- **Manage hacks:** The tool will list SNES ROM hacks for selected games.
- **Download hacks:** Download, unzip, and patch hacks automatically from
  remote URLs or local zip files. You can search _Super Mario World_ and
  _Yoshi Island_ hacks on SMWCentral's catalogue directly from within the tool.

You can check the [changelog](./CHANGELOG.txt) for an exhaustive list of changes
for every version.

## Guide

Instructions on how to use the tool and its features.

### Configure a game

Before you can download a hack, you need to configure a game. A game consists of
the following:

- _Name_: Name of the game, it can be anything (it's the name that appears in
  the tabs on top).
- _Folder_: Folder containing the hacks for the game. The tool will download
  hacks for the game inside this folder.
- _Original copy_: Original copy of the game, as a ROM. Patches downloaded with
  the tool will be applied to this file (without modifying it).

| <img src="./docs/images/configure_game.gif" alt="Configure a game" width="400px" max-width="100%" /> |
| :--------------------------------------------------------------------------------------------------: |
|                                           Configure a game                                           |

Configuring a game doesn't create any directory, it only operates existing ones.
You can remove a game from the tool through the tabs on top

| <img src="./docs/images/remove_game.gif" alt="Remove a game" width="400px" max-width="100%" style="border: 1px solid black; border-radius: 10px;" /> |
| :--------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                    Remove a game                                                                     |

Removing a game this way won't remove any folder, it will just tell the tool not
to list the game.

You can change the game's name, folder, and original copy from the game tab
itself (under the _Settings_ section, collapsed by default).

### Download a hack

To download (and patch) a hack, you have to specify:

- _Name_ (optional): A name of your choosing (usually the name of the hack).
  This will be the name of the folder created by the tool inside the game
  folder. If left empty, the tool will use the zip file name (without
  extension).
- _Download URL or local zip path_: Either a URL for downloading the zip file
  (for example, from SMWCentral) or a path to a local .zip file. On macOS and
  Linux you can use `~` as a shortcut for your home directory (for example:
  `~/Downloads/hack.zip`).

| <img src="./docs/images/download_hack.gif" alt="Download a hack manually" width="400px" max-width="100%" style="border: 1px solid black; border-radius: 10px;" /> |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                     Download a hack manually                                                                      |

You can also look for a game present on SMWCentral directly from within the tool

| <img src="./docs/images/search_hack.gif" alt="Look for a hack in SMWCentral's catalogue" width="400px" max-width="100%" /> |
| :------------------------------------------------------------------------------------------------------------------------: |
|                                         Look for a hack in SMWCentral's catalogue                                          |

You can look for _Super Mario World_ and _Yoshi Island_ hacks.

The tool will download the zip file from the given URL or use the specified
local zip file, extract it inside a folder of the chosen or derived name
(`<game_folder>/<hack_name>`), and it will patch the first `.bps` or `.ips`
file it finds.

If the URL doesn't download a zip, or if the zip doesn't contain a `.bps` file,
the operation will fail.

After you download a hack, you'll have to wait a few seconds for it to appear in
the list underneath, while the tool is syncing with the operating system.

### Manage hacks

Once you configured a game (_i.e._, selected a folder containing that game's
hacks), the tool will list hacks present in that folder. A hack is a folder
containing a `.sfc` file.

The tool provides the following operations on hacks

- **Play:** The tool opens the `.sfc` file of the hack with its default
  application (it should be an emulator). You can specify the default app on you
  operating system. If the hack has more than one `.sfc` file, each of them will
  appear as a separate row in the list, and **Play** will open the selected
  `.sfc` file.
- **Open folder:** Open the folder containing the hack. This action is shown
  once per hack.
- **Delete:** Delete the selected `.sfc` file. If there are no `.sfc` files left
  in the folder, the tool will delete the folder and all its remaining contents.

| <img src="./docs/images/play_hack.gif" alt="Hack list" width="400px" max-width="100%" /> |
| :--------------------------------------------------------------------------------------: |
|                                        Hack list                                         |

### Settings

The tab with the gear icon allows to modify global settings. Their names should
be pretty self-explanatory.

By default, the tool will open SFC files with the default app specified in the
operating system. It's possible to specify a custom emulator path and arguments
via settings. This is especially useful when using RetroArch, which requires
opening files with the `-L` flag.

You can also specify a custom cookie that will be used for search and downloads,
to bypass CAPTCHAs.

## Credits

_ROM Hack Manager_ has been developed by zuccha using:

- [Flips](https://github.com/Alcaro/Flips) by Alcaro, for patching on Windows.
- [MultiPatch](https://projects.sappharad.com/multipatch/) by Paul Kratt, for
  patching on macOS.
- [SMW Central](https://www.smwcentral.net/), for the hacks catalogue and API.

Contributors:

- [Elegist](https://github.com/robinpatzak) for implementing the custom emulator
  path.
- [nick-sds](https://github.com/nick-sds) for adding the moderated/waiting
  search option and fixing the "Kaizo: Expert" search filter.
- [spigelli](https://github.com/spigelli) for implementing the custom cookie
  setting.

## License

This tool is under GPL3, which roughly means:

- You can apply modifications to the software.
- You should credit the author for the original for, and you can credit yourself
  for the modifications.
- If you modify this software, you must label it as a modification.
- Any applications containing any part of this software must provide the full
  source code needed to modify and rebuild this application, under the same
  license. Including this interpretation is optional.
- The author claims no copyright over input, output, or error messages generated
  by this tool.

This applies to this program, Flips, and MultiPatch.

[More about GP3](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Compatibility

This software is compatible with macOS and Windows 10 or newer.

If you want to use it on Windows 7 or older, you'll need to download the version
with the installer.

This software is NOT compatible with Windows 32-bit.

## Run Locally

If you want to run the tool locally, first you will need to:

1. [Install Node](https://nodejs.org/en)
2. [Setup Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

After that, you have to clone this repository, navigate to the tool directory,
and install dependencies

```bash
git clone https://github.com/zuccha/rom-hack-manager.git
cd rom-hack-manager
npm install
```

Finally, you can run it

```bash
npm run tauri dev
```
