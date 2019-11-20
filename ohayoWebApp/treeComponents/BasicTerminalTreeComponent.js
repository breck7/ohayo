const { jtree } = require("jtree")

const { AbstractTreeComponent, AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

class TerminalCommander extends AbstractCommander {
  async saveChangesCommand() {
    const terminal = this.getTarget()
    // tood: this is broken. needs to unmount first.
    // todo: add a patch method to tree.
    if (terminal.hasChanges()) await terminal._getTab().autosaveAndReloadWith(terminal.getCode())
  }

  async executeLineCommand(lineNumber) {
    const terminal = this.getTarget()
    const program = terminal._makeProgramFromLineNumber(lineNumber)
    let result = await program.execute(terminal.getRootNode())

    if (typeof result !== "string") result = result.join("\n")

    terminal._getTab().logMessageText(encodeURIComponent(result))
    terminal.getRootNode().renderApp()
  }

  async executeFirstLineCommand() {
    return this.executeLineCommand(0)
  }

  async compileFirstLineCommand() {
    return this.compileLineCommand(0)
  }

  _compileLine(lineNumber) {
    const terminal = this.getTarget()
    const program = terminal._makeProgramFromLineNumber(lineNumber)
    const grammarProgram = program.getDefinition()
    return program.compile()
  }

  async compileLineCommand(lineNumber) {
    const terminal = this.getTarget()
    terminal._getTab().logMessageText(this._compileLine(lineNumber))
    terminal.getRootNode().renderApp()
  }
}

class BasicTerminalTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    return `.sourceTextarea
 height ${this._getHeight()}px
 font-size 110%
 border 0
 white-space nowrap
 width 100%`
  }

  getCommander() {
    return new TerminalCommander(this)
  }

  _getHeight() {
    return Math.floor((this.getRootNode().getBodyShadowDimensions().height - 60) * 0.7)
  }

  _getProgramSource() {
    const tab = this._getTab()
    return tab ? tab.getTabProgram().childrenToString() : ""
  }

  _getProgram() {
    const mountedTab = this._getTab()
    return mountedTab && mountedTab.getTabProgram()
  }

  _getTab() {
    return this.getRootNode().getMountedTab()
  }

  toStumpCode() {
    const lines = this._getProgramSource() || ""
    return `div
 style font-size: 16px;
 class TerminalDiv
 textarea
  class sourceTextarea
  stumpOnBlurCommand saveChangesCommand
  stumpOnLineClick executeFirstLineCommand
  stumpOnLineShiftClick compileFirstLineCommand
  bern${jtree.TreeNode.nest(lines, 3)}`
  }

  _getTextareaShadow() {
    return this.getStumpNode()
      .getNode("textarea")
      .getShadow()
  }

  _makeProgramFromLineNumber(lineNumber) {
    this._updateTA() // todo: cleanup
    const programClass = this._getProgram().constructor
    const code = this.getCode()
    return new programClass(new jtree.TreeNode(code).nodeAtLine(lineNumber).toString())
  }

  _updateTA() {
    if (this._getTextareaShadow()) this._getTextareaShadow().setInputOrTextAreaValue(this._getProgramSource())
  }

  treeComponentDidUpdate() {
    this._updateTA()
    super.treeComponentDidUpdate()
  }

  getDependencies() {
    const gutter = this.getParent()
    const deps = gutter.getDependencies()
    const panel = gutter.getParent()
    const tab = this._getTab()
    const tabProgram = tab && tab.getTabProgram()
    if (tabProgram && this._getProgramSource() !== this.getCode()) deps.push({ getLineModifiedTime: () => tabProgram.getLineOrChildrenModifiedTime() })
    deps.push(panel)
    return deps
  }

  _updateHtml() {
    // noop. todo: is this a good pattern? we noop it because of codemirror.
  }

  getCode() {
    const ta = this._getTextareaShadow()
    return ta ? ta.getShadowValue() : ""
  }

  hasChanges() {
    const program = this._getProgram()
    return program && this.getCode() !== program.childrenToString()
  }

  getWhetherToUpdateAndReason() {
    if (this.hasFocus())
      return {
        shouldUpdate: false,
        reason: "should NOT Update because currently has focus"
      }
    // NEVER UPDATE IF THIS HAS CHANGES.
    // todo: add tests!
    return super.getWhetherToUpdateAndReason()
  }

  hasFocus() {
    return false
  }
}

module.exports = BasicTerminalTreeComponent
