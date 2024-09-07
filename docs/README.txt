================================================================================
|                               ROM HACK MANAGER                               |
================================================================================

A tool for downloading, unzipping, and patching SNES ROM hacks all in one go!

On the official GitHub repository you can find online documentations (with
images) and the source code:

  https://github.com/zuccha/rom-hack-manager


--------------------------------------------------------------------------------
* USAGE
--------------------------------------------------------------------------------

1. Configure a game
------------------------

Before you can download a hack, you need to configure a game. A game consists of
the following:

- Name: Name of the game, it can be anything (it's the name that appears in the
  tabs on top).
- Folder: Folder containing the hacks for the game. The tool will download hacks
  for the game inside this folder.
- Original copy: Original copy of the game, as a ROM. Patches downloaded with
  the tool will be applied to this file (without modifying it).

Configured games appear on the tab bar on top.

Configuring a game doesn't create any directory, it only operates existing ones.
You can remove a game from the tool through the tabs on top. Removing a game
this way won't remove any folder.

You can change the game's name, folder, and original copy from the game tab
itself (under the "Settings" section, collapsed by default).

2. Download a hack
------------------------

To download (and patch) a hack, you have to specify:

- Name: A name of your choosing (usually the name of the hack). This will be the
  name of the folder created by the tool inside the game folder.
- Download URL: URL for downloading the zip file. For example, you can find this
  URL on SMWCentral.

You can also look for a game present on SMWCentral directly from within the
tool. You can search Super Mario World and Yoshi Island hacks.

The tool will download the zip file from the given URL, extract it inside a
folder of the chosen name (`<game_folder>/<hack_name>`), and it will patch the
first `.bps` file it finds.

If the URL doesn't download a zip, or if the zip doesn't contain a `.bps` file,
the operation will fail.

After you download a hack, you'll have to wait a few seconds for it to appear in
the list underneath, while the tool is syncing with the operating system.

3. Manage hacks
------------------------

Once you configured a game (i.e., selected a folder containing that game's
hacks), the tool will list hacks present in that folder. A hack is a folder
containing a `.sfc` file.

The tool provides the following operations on hacks:

- Play: The tool opens the `.sfc` file of the hack with its default application
  (it should be an emulator). You can specify the default app on you operating
  system. If the hack has more than one `.sfc` file, the tool will play the one
  that you see in the table (you cannot control which one).
- Open folder: Open the folder containing the hack.
- Delete: Delete the hack. This deletes the folder of the hack and all its
  contents.

4. Settings
------------------------

The tab with the gear icon allows to modify global settings. Their names should
be pretty self-explanatory.

By default, the tool will open SFC files with the default app specified in the
operating system. It's possible to specify a custom emulator path and arguments
via settings. This is especially useful when using RetroArch, which requires
opening files with the `-L` flag.

You can also specify a custom cookie that will be used for search and downloads,
to bypass CAPTCHAs.


--------------------------------------------------------------------------------
* CREDITS
--------------------------------------------------------------------------------

ROM Hack Manager has been developed by zuccha using:

- Flips by Alcaro, for patching on Windows (https://github.com/Alcaro/Flips).
- MultiPatch by Paul Kratt, for patching on macOS
  (https://projects.sappharad.com/multipatch).
- SMW Central, for the hacks catalogue and API.

Contributors:

- Elegist (https://github.com/robinpatzak) for implementing the custom emulator
  path.
- nick-sds (https://github.com/nick-sds) for adding the moderated/waiting search
  option and fixing the "Kaizo: Expert" search filter.
- spigelli (https://github.com/spigelli) for implementing the custom cookie
  setting.


--------------------------------------------------------------------------------
* LICENSE
--------------------------------------------------------------------------------

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

More about GP3: https://www.gnu.org/licenses/gpl-3.0.en.html

