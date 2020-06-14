20.1.0 2020-6-13
----------------
- New: added roughjs.line tile
- New: added columns.keepNumerics tile
- New: added filter.withAny tile

20.0.0 2020-3-1
---------------
- New: added insert between button to tiles
- New: roughjs.bar and roughjs.pie tiles
- New: two new templates showing roughjs usage
- Breaking: removed "title" content from tables.basic
- Breaking: removed doc.defaultHidden
- Fix: updated jtree with pivot table fix
- Fix: when you delete a tile using the button it only deletes that tile
- Fix: Bigger down arrow for tile dropdown menu
- Fix: autosave tab after clicking tile picker command
- Fix: debug.commands tile regression fix
- Infra: test all templates command
- Infra: removed TileHeader, TileGrabbers
- Infra: removed duplicate TilePicker code

19.3.0 2020-2-7
---------------
- New: owid.list tile

19.2.0 2020-2-7
---------------
- New: text.template, row.sample, and asciichart.line tiles

19.1.0 2020-02-05
-----------------
- New: Text permalink, trim, and replace tiles
- Fix: Rename and Clone Tab now preserve tab order
- Fix: added test and fix for create program from tile example

19.0.0 2020-02-04
-----------------
- New: one click insert tile button
- New: one click new file button
- New: top menu simplified and tabs moved to top menu
- New: file commands moved to tabs. Ability to use file commands on all tabs, not just focused tab.
- New: speed improvements
- Fix: fixed bug related to closing tabs
- Fix: fixed bug related to closing last tab
- Fix: fixed overflow tabs bug
- Fix: fixed bugs related to toggling gutters/menu
- Breaking: removed doc.layout and tree, bin, and custom layouts. Only layout is now column.
- Removed: drag select tiles, resize tiles, move tiles
- Removed: removed all context menus in favor of visible dropdowns
- Infra: removed jquery-ui
- Infra: refactored TCF components to better represent page state
- Infra: removed windowSize

18.0.0 2020-1-24
----------------
- Breaking: Maia language is now simply named Ohayo. "maia" file extension is now "ohayo"
- Breaking: removed support for Fire, Hakon, Stump and all other Tree Languages
- Breaking: removed compilation and execution commands
- Infra: Merged separate Tiles language into Ohayo
- Infra: Renamed OhayoApp to StudioApp
- Fix: fixed css race condition in "New" drop down menu

17.4.0 2020-1-24
----------------
- Fix: updated Jtree to fix windows return character bug
- New: cdc tiles

17.3.0 2020-1-23
----------------
- New: gen tiles
- New: human population, tld, life expectancy templates
- New: text.reverseSplit tile
- New: owid tile
- Fix: toggling focused mode now puts menu back in correct place
- Infra: changed fab.html to dev.html
- Breaking: date.heatcal is now calendar.heat

17.2.0 2020-1-3
---------------
- New: pca tile
- Fix: updated jtree to get clean columns name fix

17.1.0 2019-12-14
-----------------
- New: show.value tile
- New: text.matches tile
- New: github.info tile
- New: GitHub basic info template and github comparison template
- New: wikipedia.page tile
- New: publicapis.entries tile
- New: wikipedia, publicapi, and maia grammar templates
- Infra: dataDomain property on web connected providers
- Infra: abstractUrls node

17.0.0 2019-12-12
-----------------
- New: data.synth tile
- New: schema.toSimple and schema.toTypescript tiles
- New: data.usabilityScore tile
- New: print.text and print.csv methods
- New: isDataPublicDomain, dataUrl, and dataDescription properties for data usability score
- New: text.firstLetter tile
- New: columns.rename tile
- New: fill.missing tile
- New: templates: boiling point, periodic table, country-names, country pops, ohayo product, declaration, typescript interface generator
- New: now gallery tiles pass through data
- New: data.about tile
- New: debug.grammar tile
- New: moz.top500 tile
- Breaking: shell.csv is now print.csv and shell.typescript is now schema.toTypescript
- Breaking: text.substring tile now renames column to "substring". Use columns.rename for old behavior.
- Fix: html tiles selectable
- Fix: show.columnCount default title fix
- Fix: fixed bugs in population.tsv
- Infra: updated Jtree to 49.4.0
- Infra: fabWithLocalStorage.html route

16.4.0 2019-12-9
----------------
- Fix: column name autocomplete fixes and tests
- New: Print error count onsave in code editor
- New: templates now a provider
- New: shell.typescript
- Infra: Tile requirement loading code cleanup.

16.3.0 2019-12-9
----------------
- Fix: data.localStorage editing bug fix
- New: columns.cleanNames tile

16.2.0 2019-12-9
----------------
- Fix: dropIfMissing fix
- Infra: updated jtree to get deterministic table parsing

16.1.0 2019-12-8
----------------
- New: rows.dropIfMissing tile
- Infra: updated to Jtree 49
- Infra: examples are now type checked
- Infra: command line maia now doesn't print anything unless tiles do it

16.0.1 2019-12-6
----------------
- Fix: whitespace in doc.code is now pre
- Fix: doc.code code is escaped for html and added test
- Fix: fixed uncaught error in code mirror editor on save
- Infra: moved theme code to one place

16.0.0 2019-12-6
----------------
- New: columns.drop, columns.dropConstants and show.columnCount tiles
- New: samples.portals tile
- New: portals and maia-reference templates
- New: blank lines are allowed in Maia
- New: doc.title, doc.subtitle, doc.section, doc.ref, doc.categories, doc.author, doc.date tiles
- Breaking: comment is now doc.comment
- Breaking: layout is now doc.layout
- Breaking: defaultHidden is now doc.defaultHidden
- Breaking: zoom is now doc.zoom
- Breaking: tiles.picker is now doc.picker
- Infra: transferred more JS to stump

15.5.1 2019-12-3
----------------
- Fix: fixed autocomplete regression

15.5.0 2019-12-02
-----------------
- Infra: upgraded to Jtree 48

15.4.0 2019-11-30
-----------------
- New: more templates
- New: template tile now has categories
- New: math.gen tile
- New: categories, zoom and defaultHidden doc level properties in Maia
- Fix: random tiles fix
- Infra: removed meyer css reset

15.3.0 2019-11-29
-----------------
- New: show.static tiles for issue #42.
- New: footer styling is now more minimal.
- Fix: fixed pencil icon too low in some tiles.
- Infra: updated to JTree 47.1 for new stump and perf improvements from parser cacheing.
- Infra: moved off nest method in grams and toward typed stump templates.

15.2.0 2019-11-20
-----------------
- Infra: Updated to JTree 46. Removed Commander Classes
- Infra: switched some tests to use getTextContent
- Fix: inplace cellTypeTree bug
- Fix: for #36

15.1.0 2019-11-19
-----------------
- New: easier to create distributable copies via `jtree build buildDist destFolder`
- New: experimenting with using background textures from transparenttextures.com

15.0.0 2019-11-10
-----------------
- Breaking: Flow is now named Maia
- Breaking: in Flow acs.cases2019 is now cancer.cases

14.0.3 2019-11-2
----------------
- Fix: hn fix

14.0.2 2019-11-2
----------------
- Fix: deep link fixes and tests
- Fix: hn fix

14.0.1 2019-11-2
----------------
- Fix: you can now use server side storage not on local host
- Infra: updated jtree

14.0.0 2019-11-01
-----------------
- New: Flow now works on the command line too
- New: full source code released
- Breaking: keyword for comment is now comment and not #
- Infra: JTable moved to Jtree
- Infra: Updated to TreeComponentFramework
- Infra: Updated to Jtree 44.0.0 from 25.2.0
- Infra: now compiled product is only 1 unminified js file

13.0.0 2019-6-09
----------------
- New: bar tile now has colorColumn support
- New: scatter tile now has colorColumn and shapeColumn support
- New: filter comparisons now work for dates
- New: groupBy multiple columns in pivot tables
- New: math.log and rows.addOne tiles
- New: improvements to tab styles, code editor style, web tile styles, provider shows output columns
- New: show output columns in tile toolbar
- Breaking: format property is now "parser"
- Breaking: wordCount output column is now "word" instead of "name"
- Breaking: show.count is now show.rowCount and there is no column param
- Fix: removed some keyboard shortcuts so that hard refresh again works on Linux
- Fix: large number of parsing and type fixed with new JTable code
- Fix: missing columns bug when parsing tree rows
- Fix: vega time unit fixes
- Fix: persisting of column types after transformations
- Infra: binder to JTable

12.2.0 2019-6-04
----------------
- New: new tiles including rows.sortByReverse, text.length, text.toLowerCase
- New: new templates including word cloud, cancer, and amazon
- New: onsave in code editor will scroll current tile into view
- New: ctrl+s in code editor now saves on Linux/Windows
- Breaking: text.lc is now text.lineCount and text.wc is now text.wordCount
- Fix: wordcloud sizing fix

12.1.0 2019-6-03
----------------
- New: when appending a snippet, new tile should scroll into view
- New: updated homepage title
- Fix: text in markdown and other text tiles now selectable

12.0.0 2019-6-03
----------------
- New: new tiles including rows.sortBy, rows.reverse, rows.shuffle, samples.babyNames
- New: new condensed and more minimal style for provider and transformer tiles
- New: deep links
- New: all Tiles must have all code locally, and cannot fetch&eval remote js code
- New: added rowDisplayLimit on chart tiles.
- New: working dir and version # moved to top of help
- New: vega charts accept title inline
- New: now node tiles can do fs.readFile for shipped local datasets for better perf and testing
- New: add answers to challenges inline
- Breaking: removed "orderBy" property. use rows.sortBy and rows.reverse to achieve same behavior
- Breaking: removed "rowLimit" property. use rows.first OR use rowDisplayLimit on chart tiles.
- Breaking: removed "title" property. use inline title where available.
- Breaking: removed "goog" tiles
- Breaking: removed "youtube" tiles
- Breaking: rows.countBy is now rows.addIndexColumn
- Fix: fix for tiles downstream of columns.keep regetting those columns
- Infra: updated jtree to 25.2 to fix flakey tests
- Infra: Added debugTile grammarTree tile

11.0.0 2019-5-30
----------------
- New: flow now has comments
- New: codeeditor now some inline parameter hinting, inline error messages, inline error suggestion fixes
- New: codeeditor now has error coloring for extra word errors
- New: parameter hints on tile toolbar
- New: improved styling for most tile default states
- Breaking: filter.with and filter.without now search for words one at a time, instead of as searching for a joined string
- Breaking: changed datatables.basic to dtjs.basic
- Fix: fixed non-flow language basic tile loading regression and added tests
- Fix: fixed tree layout incorrect top computation
- Fix: fixed bug where clearing an input in the WallUI did not update source
- Fix: restored proper code editor and console heights
- Fix: deleting selection that had both parent and child didnt delete child fix and added test
- Infra: package.json dependencies cleanup
- Infra: updated jtree to 25.1.0

10.4.0 2019-5-26
----------------
- New: improved scrolling behavior so only wall scrolls while editor and tabs stay
- New: instant loading of new tabs
- New: text.substring tile
- New: filter now supports types
- New: improved error highlighting
- Fixes: web post, delete selection regression fix, date parsing fix, shift+selection regression, picker tile regression fix
- Infra: increased branch coverage

10.3.0 2019-5-24
----------------
- New: loading messages will appear for long-loading tiles
- New: deleting a tile now shifts its children left instead of deleting them as well
- New: hakon and stump editing support
- New: added templates tile to homepage
- New: trends in baby name template
- Fix: lots of async fixes and more tests
- Infra: debug.tiles

10.2.0 2019-5-22
----------------
- New: startup is ~75ms faster (due to grammar parsing speed up in Jtree)
- New: style improvements to html and show tiles
- New: style changes to make console easier to read
- New: heat calendar tile now has hover info
- New: match.columnsFuzzy now takes column name params
- Fix: filter tiles now don't re-add dropped columns
- Fix: changes made to tiles directly in UI should now correctly update themselves and dependents
- Fix: source code visualizer works better with correct cell type parsing now
- Fix: syntax highlighting fixes from new jtree
- Fix: when changing layout, console message appears correctly now
- Fix: match.columnsFuzzy now outputs correct confidence score
- Breaking: match.fuzzy is now match.columnsFuzzy
- Infra: updated to jtree 24
- Infra: moved column predictions to binder and improvs is now columnPredictionHints
- Infra: updated swarm/trooper/gopher

10.1.0 2019-5-18
----------------
- New: now works as an npm dependency
- New: now have rename and move file commands
- New: hn tiles
- New: proxy cache in desktop version
- Breaking: instead of "@settings layout" it is now just "layout"
- Breaking: html.h2-h6, p, pre, tiles removed in favor of html.text and html.printAs
- Breaking: html tiles have been refactored to be less ambiguous. Should be okay unless relying on undocumented behavior.
- Breaking: editor.hello is now editor.helloWorld
- Breaking: removed web.cache. LocalStorage has <7MB of space available, so not so useful. In memory cache + proxy cache + browser's normal cache still here.
- Breaking: remove airtraffic tiles
- Fix: fixed bug in filtering on string columns
- Fix: added missing npm packages to package.json
- Fix: better error reporting when server side write fails
- Fix: correctly set server side cwd
- Infra: HTTPResponse code cleanup
- Infra: added "es6" to compiled min file routes

10.0.0 2019-5-16
----------------
- New: column autocomplete
- New: vega tiles
- New: filter.where tile, text.split, debug.parserTest, many more sample tiles
- New: rows.dropMissing tile
- New: rows.countBy tile
- New: "Copy data as Javascript" context menu option
- New: added "reduce" setting for group.by tiles in place of columnsObject
- New: close all files except open file menu option
- New: new tile stubs: datatables, dcjs, amazon, fitbit
- New: removed Google Analytics
- New: tables.basic now takes a title inline
- New: support for dropping multiple-table csv files
- New: default layout is now tiled
- Breaking: charts.kpi is now "show.{reduction} columnName Title words"
- Breaking: "x" is now "xColumn" and "y" is "yColumn" tile wide
- Breaking: gender is now genderColumn
- Breaking: "visible false" is now "hidden"
- Breaking: "data.local" is now "data.localStorage"
- Breaking: "maximize true" is now "maximized"
- Breaking: date.expand is now date.addColumns
- Breaking: tables.advanced is now handsontable.basic
- Breaking: filter.has and filter.includes are now filter.with
- Breaking: filter.no is now filter.without
- Breaking: removed filter.advanced tile
- Breaking: limit property is now rowLimit and columnsLimit is now columnLimit
- Breaking: remove columns property from table tiles. Use columns.keep
- Breaking: removed columnsObject
- Breaking: charts.heatcal is now date.heatcal
- Breaking: "average" renamed to "mean" app-wide (in reductions)
- Fix: rendering performance improvements
- Fix: better parsing of Javascript dataTables
- Fix: better tile error message handling
- Fix: prevent back button navigation on left scroll overflow
- Fix: better tile sizing in layouts
- Fix: change parent fixed
- Fix: fixes to column type parsing including USD and dates
- Infra: binder moved to separate typescript project
- Infra: plugins folder for easier plugin development and support for TypeScript tiles
- Infra: updated to Jtree 22+

9.0.0 2019-4-26
---------------
- New: sublime syntax highlighting for Flow
- New: autocomplete for more words
- New: improved CodeMirror syntax highlighting
- New: filter tiles
- New: introduced "working folder"
- New: desktop app now has ability to open any file/folder. You can also switch between disk and localStorage
- New: disk.read tile
- New: "column" and "tiled" layout options
- New: flowSamples folder and more data samples
- New: more sample tiles including kaggle tile
- New: columns and rows tiles
- Breaking: ALL tiles now do not contain a trailing ">"
- Breaking: slang property to content
- Breaking: @wall to @settings
- Breaking: apply.filter> to filter.advanced
- Breaking: apply.group> to group.by
- Breaking: samples.iris> to samples.tinyIris
- Breaking: misc.flights> to airtraffic.flights and misc.delays> to airtraffic.delays
- Breaking: misc.youtube> to youtube.play and misc.3d> to treenotation.3d
- Breaking: social.reddit> to reddit.all, social.subreddits> to reddit.subs, social.subreddit> to reddit.sub
- Breaking: social.hn> to hackernews.top
- Breaking: apply.join> to join.by
- Breaking: apply.types> to treenotation.wordTypes
- Breaking: apply.fuzz> to match.fuzzy
- Breaking: apply.convert apply.extend apply.parse removed
- Breaking: stats.summary to columns.describe, stats.lc to text.lc stats.wc to text.wc
- Breaking: charts.wordcloud to text.wordcloud
- Breaking: views.markdwon to markdown.basic, views.outline to treenotation.outline, views.dotline to treenotation.dotline
- Breaking: system.commands is now editor.commandHistory
- Fix: fixed update bugs previously requiring manual reloading of tiles
- Fix: text select bug fix
- Fix: fixed bug previously requiring a reload after a file rename
- Fix: tree layout works better
- Fix: fixed web.get bug when a blank url is fetched
- Fix: fixed bug where tile z-index stacking was reversed
- Fix: when a tile has an error during rendering we catch it and display an error tile
- Infra: file/folder/disk refactor
- Infra: upgraded to jtree 19+ for new autocomplete and syntax highlighter
- Infra: many more tests, @examples, @descriptions and tile quality checking

8.1.0 2019-2-28
---------------
- New: autocomplete now opens on keypress
- New: data.local> tile
- New: url tiles default to caching
- New: error message indicator on url tiles
- New: default theme is now "workshop"
- New: file drop now uses local data tile
- New: improved table styling
- New: Google tiles now have dummy data
- Breaking: changed default local server port to 1111 from 8008
- Breaking: data.auto> is now data.inline>
- Fix: npm missing package dependencies fix
- Fix: editor color fixes across themes
- Fix: to advanced (HOT) table

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
