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
