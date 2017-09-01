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
