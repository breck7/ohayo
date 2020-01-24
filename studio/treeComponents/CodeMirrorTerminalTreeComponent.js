const { jtree } = require("jtree")

const BasicTerminalTreeComponent = require("./BasicTerminalTreeComponent.js")

/*NODE_JS_ONLY*/ const ohayoNode = require("../../ohayo/ohayo.nodejs.js")

// TODO!!!! UNDO/REDO HISTORY IS SAVED ACROSS TAB SWITCHES.

const CodeMirrorConstants = {}

CodeMirrorConstants.options = {}
CodeMirrorConstants.options.theme = "theme"
CodeMirrorConstants.themes = {}
CodeMirrorConstants.themes.oceanicNext = "oceanic-next"
CodeMirrorConstants.themes.default = "default"
CodeMirrorConstants.events = {}
CodeMirrorConstants.events.blur = "blur"
CodeMirrorConstants.events.gutterClick = "gutterClick"
CodeMirrorConstants.keyMap = {}
CodeMirrorConstants.keyMap.cmdEnter = "Cmd-Enter"
CodeMirrorConstants.keyMap.shiftCmdEnter = "Shift-Cmd-Enter"
CodeMirrorConstants.keyMap.cmdBackSlash = "Cmd-\\"
CodeMirrorConstants.keyMap.cmdS = "Cmd-S"
CodeMirrorConstants.keyMap.ctrlS = "Ctrl-S"

class CodeMirrorTerminalTreeComponent extends BasicTerminalTreeComponent {
  getCode() {
    // todo: this is buggy! figure it out. when toggling pane, it comes back w/o highlighting.
    // probably shouldn't need this if check
    const cm = this._getCMEditorInstance()
    return cm ? cm.getValue() : ""
  }

  _getCMEditorInstance() {
    return this._CMEditorInstance
  }

  hasFocus() {
    const cm = this._getCMEditorInstance()
    return cm && cm.hasFocus()
  }

  treeComponentDidMount() {
    this._loadCodeMirror()
    super.treeComponentDidMount()
  }

  _updateTheme() {
    const cm = this._getCMEditorInstance()
    if (cm.getOption(CodeMirrorConstants.options.theme) !== this._getCMThemeToUse()) cm.setOption(CodeMirrorConstants.options.theme, this._getCMThemeToUse())
  }

  _updateTA() {}

  treeComponentDidUpdate() {
    const cm = this._getCMEditorInstance()
    // todo: perf problems here.
    if (cm) {
      this._updateTheme()
      cm.setValue(this._getProgramSource())
    }
    super.treeComponentDidUpdate()
  }

  _getKeyMap() {
    const cm = this._getCMEditorInstance()
    const keyMap = {}

    keyMap[CodeMirrorConstants.keyMap.cmdBackSlash] = () => {
      this.getRootNode().clearTabMessagesCommand()
    }

    keyMap[CodeMirrorConstants.keyMap.cmdS] = async () => {
      await this.saveChangesCommand()
      const app = this.getRootNode()
      await app.cellCheckProgramCommand()
      // todo: scroll to proper tile
      const tile = this._getClosestTileAtCurrentLine()
      if (tile) tile.scrollIntoView()
    }

    keyMap[CodeMirrorConstants.keyMap.ctrlS] = keyMap[CodeMirrorConstants.keyMap.cmdS]

    return keyMap
  }

  _getClosestTileAtCurrentLine() {
    const cm = this._getCMEditorInstance()
    const range = cm.listSelections()[0]
    const line = range && range.head.line
    const app = this.getRootNode()
    const tab = app.getMountedTab()
    const tabProgram = tab.getTabProgram()
    return tabProgram && line !== false ? tabProgram.getTileClosestToLine(line) : undefined
  }

  _getCMThemeToUse() {
    return this.getRootNode().isGlassTheme() ? CodeMirrorConstants.themes.oceanicNext : CodeMirrorConstants.themes.default
  }

  _loadCodeMirror() {
    if (!CodeMirrorTerminalTreeComponent._cMMode) {
      const app = this.getRootNode()

      CodeMirrorTerminalTreeComponent._cMMode = new jtree.TreeNotationCodeMirrorMode(
        "tree",
        () => ohayoNode,
        () => (app.getMountedTab() ? this.getCode() : undefined),
        CodeMirror
      ).register()
    }

    const cmInstance = CodeMirrorTerminalTreeComponent._cMMode.fromTextAreaWithAutocomplete(this._getTextareaShadow().getShadowElement(), {
      theme: this._getCMThemeToUse()
    })

    this._CMEditorInstance = cmInstance

    cmInstance.setSize(undefined, this._getHeight())

    cmInstance.on(CodeMirrorConstants.events.blur, () => {
      // note: if you have changes in terminal/gutter, they will be saved. no cancel yet.
      this.saveChangesCommand()
    })
    cmInstance.addKeyMap(this._getKeyMap())

    let waiting
    const codeWidgets = []
    cmInstance.on("keyup", () => {
      clearTimeout(waiting)
      waiting = setTimeout(() => this._updateHints(cmInstance, codeWidgets), 100)
    })
  }

  _updateHints(codeInstance, codeWidgets) {
    const app = this.getRootNode()
    const tab = app.getMountedTab()
    const program = new ohayoNode(this.getCode())
    const errs = program.getAllErrors()
    const cursor = codeInstance.getCursor()

    // todo: what if 2 errors?
    codeInstance.operation(function() {
      codeWidgets.forEach(widget => codeInstance.removeLineWidget(widget))
      codeWidgets.length = 0

      errs
        .filter(err => !err.isCursorOnWord(cursor.line, cursor.ch))
        .slice(0, 1) // Only show 1 error at a time. Otherwise UX is not fun.
        .forEach(err => {
          const el = err.getCodeMirrorLineWidgetElement(() => {
            codeInstance.setValue(program.toString())
            // todo: do we need to trigger update?
          })
          codeWidgets.push(codeInstance.addLineWidget(err.getLineNumber() - 1, el, { coverGutter: false, noHScroll: false }))
        })
      const info = codeInstance.getScrollInfo()
      const after = codeInstance.charCoords({ line: cursor.line + 1, ch: 0 }, "local").top
      if (info.top + info.clientHeight < after) codeInstance.scrollTo(null, after - info.clientHeight + 3)
    })
  }
}

module.exports = CodeMirrorTerminalTreeComponent
