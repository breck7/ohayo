const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

class BasicTerminalTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    return `.sourceTextarea
 height ${this._getHeight()}px
 font-size 110%
 border 0
 white-space nowrap
 width 100%`
  }

  async saveChangesCommand() {
    // tood: this is broken. needs to unmount first.
    // todo: add a patch method to tree.
    if (this.hasChanges()) await this._getTab().autosaveAndReloadWith(this.getCode())
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
    return new jtree.TreeNode(`div
 style font-size: 16px;
 class TerminalDiv
 textarea
  class sourceTextarea
  blurCommand saveChangesCommand
  bern
   {lines}`).templateToString({ lines: this._getProgramSource() })
  }

  _getTextareaShadow() {
    return this.getStumpNode()
      .getNode("textarea")
      .getShadow()
  }

  _updateTA() {
    if (this._getTextareaShadow()) this._getTextareaShadow().setInputOrTextAreaValue(this._getProgramSource())
  }

  setFile(fileName) {
    this.setWord(1, fileName)
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
