8.0.0 2019-02-10
----------------
- New: all previous versions of Ohayo accessible at v1/v2/vN.ohayo.computer
- Breaking: all tile names are new. This version implements namespacing.
- New: web get, post, and dump tiles.
- New: better didyoumean tiles
- New: added right click on tile and export to tree file option
- Infra: updated jtree for perf gains

7.1.0 2019-01-04
----------------
- Fix: fixed selection, editor, presidents, and other bugs
- New: added iris, mtcars, and populations tiles
- New: display improvements to morph tile
- New: insert tile and reset ohayo keyboard shortcuts

7.0.0 2017-12-7
---------------
- New: added npm install ohayo and ohayo cli command

6.0.1 2017-11-24
----------------
- New: >img and >fuzz tiles
- Fix: morph and other fixes

6.0.0 2017-11-14
----------------
- New: switched focus to only data dashboards now that Tree Languages moved to JTree project

5.4.1 2017-11-13
----------------
- Fix: >morph tile regression fix

5.4.0 2017-11-13
----------------
- Infra: updated to jtree

5.3.0 2017-11-8
---------------
- Infra: Updated to otree
- Changes: removed rusty and turtle support for now

5.2.1 2017-11-2
---------------
- Infra: updated to Tree 9

5.2.0 2017-10-28
----------------
- Infra: updated to Tree 8

5.1.4 2017-10-28
----------------
- Infra: code cleanup for TP 8

5.1.3 2017-10-19
----------------
- Fix: changed some dangling ETN references to Tree Languages
- Infra: some code cleanup to prepare for new TP library

5.1.2 2017-9-22
---------------
- Infra: grammar file cleanup and prep work for v6.0 and more tests.

5.1.1 2017-9-17
---------------
- Fix: some code mirror color highlighting fixes
- Infra: grammar type checking, swarm grammar, grammar grammar, upgrade language, other fixes

5.1.0 2017-9-16
---------------
- New: improved autocomplete
- New: improved flow grammar highlighting
- Breaking: >tags keyword in flow is now >types

5.0.1 2017-9-15
---------------
- Fix: fixed regression in loading of 3D vis
- Fix: parse subsettings correctly in flow
- Infra: updated Tree to 7.1

5.0.0 2017-9-14
---------------
- New: color word type highlighting for all languages
- New: scoped autocomplete for all languages
- New: 100% word type checking for all languages
- New: 300% perf improvement when loading multiple programs
- Breaking: removed a number of tiles from flow and updated others
- Infra: Grammar CC, Blaze VM, sublime syntax, Tree 7, removed monad, auto to improvs, slot types, program errors
- More infra: gopher & swarm improvements, Inspect, Profile, async/await, tape to tap, remove details, settings

4.2.1 2017-9-6
--------------
- Fix: fixed bug where deleting tiles other than newest was not updating source editor

4.2.0 2017-9-6
--------------
- New: create turtle or rusty files
- New: ETNs now always in tree layout
- New: line count block in flow
- New: server storage for desktop app
- Breaking: removed text, coder blocks in flow
- Fix: html escape fix in data block
- Fix: close last tab render fix
- Fix: close all tabs render fix
- Fix: fix to Fib example compilation in fire
- Fix: tab change tiles not appearing render fix
- Infra: FlexWall, Files & Folders, Removed Diff & JSSHA, Tests & Diagnostics

4.1.1 2017-9-1
--------------
- New: shift+c type checking command
- Infra: better support for typed ETNs

4.1.0 2017-8-31
---------------
- Fix: heatcal and other flow tile fixes
- Breaking: changed "pin" to width/height/top/left
- Infra: 82%

4.0.0 2017-8-30
---------------
- Infra: SnapProgram Split, Wall, Tabs, Tiles, TileProcess, Dictionary improvements, Swarm Improvements, Details, App state storage, Commanders, Metrics, Gopher, 79%

3.2.2 2017-8-24
---------------
- New: better typing output in flow
- Breaking: in flow ">slots" is now ">tags"
- Breaking: in fire "set$+" is now "join"
- Infra: Upgrade to Tree 6.0.0, dictionary improvements (frequency, compiled, parameters, variable arity), cli improvements, swarm static

3.2.1 2017-8-23
---------------
- New: drag and drop CSV support
- New: program names cannot have spaces
- New: groupBy now will group empty groups
- Fix: Blank lines are now not visible by default
- Fix: fix to some google charts
- Infra: flows folder, line count & dashboard, ProgramRunner, dictionary compilation, more swarm files

3.1.6 2017-8-23
---------------
- New: drag and drop files to create programs
- Breaking: flow removed >input cog
- Breaking: fire removed class and subclass
- Infra: merged wall into swarm, stumpprogram, willowprogram, removed WithChildren usage, collapsedNode, stump/bern/monad

3.1.5 2017-8-22
---------------
- Fix: update to hello world demo fire program

3.1.4 2017-8-22
---------------
- New: added "New from URL" command
- New: cork theme
- New: cmd+\ shortcut in the code editor to clear console
- New: added >flights and >delays cogs to flow
- New: many flow cogs are now hidden by default
- New: 3d vis of programs now keeps z-index at 1 for words, also dotSize param added, and better tag/type/slots
- Fix: edits via toolbar not immediately reflected (thanks DZ)
- Fix: changing corkboard layout of a program now generates a log message
- Fix: log messages are now rendered as they come in
- Fix: cmd+a select all now shows border
- Breaking: most fire cogs renamed (ie: ::$ to log$, =# to set#)
- Breaking: >editor cog in flow is now >coder
- Infra: blocks to cogs, slots, swarm, mash, dictionary improvements, corkboard, desktop routes

3.1.3 2017-8-20
---------------
- New: changed "File" dropdown to "New" dropdown, removed open dropdown, and moved other "File" commands to program contextmenu
- Fix: fixed recursive "pin" bug reported by DZ.
- Infra: updated Tree Notation; switched to Tuples; removed structPath; dictionary instruction renaming; dictionary parsing work

3.1.1 2017-8-18
---------------
- Fix: flow bugs in row parsing
- Fix: bugs in 3d vis
- Fix: word cloud fix
- New: language detection
- Infra: modularization

3.1.0 2017-8-15
---------------
- New: added categories to keyboard shortcuts
- Fix: row parsing bug fixes
- Fix: node editor bug fixes
- Infra: Switched to Dictionary from Blueprints
- Infra: EOL Electron

3.0.0 2017-8-8
--------------
- New: replaced textarea source editor with full fledged codemirror editor
- New: added console output to gutter and load on open
- New: source editor starts open
- New: press Command+s to save and render blocks visualization of code in source editor
- New: press Command+enter to build and execute the selected tree in source editor
- New: press Command+shift+enter to build and print the selected tree to the console
- New: autocomplete in source editor using ctrl+spacebar
- Fix: lots of rendering and other bug fixes
- Removed: removed the search/open program input box

2.2.0 2017-8-04
---------------
- Breaking: flow. removed ">output" block. Use ">dump"
- Breaking: flow. removed ">echo" block. Use ">text".
- New: flow. Added "replacer" block.

2.1.0 2017-7-31
---------------
- New: added >settings block, which by default is hidden and includes program settings like layout
- New: shift+m shortcut to generate mini map
- Breaking: changed "layout" property in flow to be a sub property of the settings block node
- Fix: resize and move block bug fixes
- Fix: shift+v fix when you are analyzing a program that contains an unknown node type
- General: more tests and fixes.

2.0.0 2017-7-27
---------------
- New: added "Hello World" fire example
- New: added shift+v keyboard shortcut to visualize a program
- New: added shift+e shortcut to execute a program
- New: Flow. added "echo" block
- New: Flow. added "wordcloud" block
- Under-the-hood: replaced HTML and DOM operations with Stump ETN and Willow.
- Breaking: Flow. renamed "out" block to "dump"
- Breaking: Fire. Renamed lots of node types "fn" is now "=fn", "." is now "=.>>", "call" is now ">>".
- General: updated Tree Notation library to 5.0
- General: bug fixes and more tests

1.2.4 2017-7-02
---------------
- General: bug fixes, tests, and speed improvements

1.2.3 2017-6-28
---------------
- General: bug fixes and more tests

1.2.1 2017-6-26
---------------
- New: Last mounted program is now restored when you refresh the page
- New: Blocks can now be moved from the top or the bottom
- New: "Save" button to compile output modal window
- New: keyboard shortcut for saving compiled output
- New: open many command
- New: Added descriptions for Fire blocks
- Fix: Compile command improvements and modal bug fix
- Fix: for 3D ETN rendering
- Fix: for programs larger than browser window
- General: Fire block bug fixes and improvements
- General: More tests

1.1.0 2017-6-25
---------------
- Breaking: Programs no longer have "etn" property. Instead, uses file extension. Defaults to Flow.
- New: Added create fire/flow program to reflect above change.
- New: added 3D flow chart block
- General: Improvements to Flow column guesser
- General: Bug fixes and more tests

1.0.3 2017-6-23
---------------
- "If you're not embarrassed when you ship your first version, you waited too long"
- "We don't believe in shipping a product before it's ready, and we need a little more time"
- This is somewhere in the middle. Ready for researchers, not ready for professionals
