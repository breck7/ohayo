const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const TilesConstants = require("../tiles/TilesConstants.js")

const OhayoConstants = require("./OhayoConstants.js")

class TabTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    const index = this.getIndex()
    const fullPath = this.getFullTabFilePath()
    const filename = this.getFileName()
    const isMounted =
      this.getParent()
        .getParent()
        .getMountedTabName() === fullPath
    return `a ${filename}
 stumpOnClickCommand mountTabByIndexCommand
 stumpCollapse
 value ${index}
 title ${fullPath}
 class TabStub ${isMounted ? "mountedTab" : ""}
 span x
  stumpCollapse
  stumpOnClickCommand closeTabByIndexCommand
  value ${index}
  class closeTabButton`
  }

  getDependencies() {
    return [this.getParent().getParent()]
  }

  getDeepLink() {
    const obj = {}
    obj[OhayoConstants.deepLinks.filename] = this.getFileName()
    return this.getRootNode()
      .getWillowProgram()
      .toPrettyDeepLink(this.getTabProgram().childrenToString(), obj)
  }

  getContextMenuCommandsStumpCode() {
    const grammarProgram = this.getTabProgram().getGrammarProgram()

    return `a Save File
 stumpOnClickCommand saveTabAndNotifyCommand
a Rename File
 stumpOnClickCommand showTabRenameFilePromptCommand
a Move File
 stumpOnClickCommand showTabMoveFilePromptCommand
a Clone File
 stumpOnClickCommand cloneTabCommand
a Delete File
 stumpOnClickCommand showDeleteFileConfirmDialogCommand
a Copy program as link
 stumpOnClickCommand copyDeepLinkCommand
a Log program stats
 stumpOnClickCommand printProgramStatsCommand
a Close all other files
 stumpOnClickCommand closeAllTabsExceptFocusedTabCommand
a Save compiled '${grammarProgram.getTargetExtension()}' file
 tabindex -1
 stumpOnClickCommand saveCompiledCommand`
  }

  autosaveAndRender() {
    const savingPromise = this.autosaveTab()
    this.getRootNode().renderApp()
    return savingPromise
  }

  async autosaveAndReloadWith(str) {
    this.getTabProgram().setChildren(str)
    await this.autosaveTab()
    this.getTabWall().unmount() //ugly!
    await this._initProgramRenderAndRun(str)
    this.getRootNode().renderApp()
  }

  _getPanel() {
    return this.getParent().getParent()
  }

  async _initProgramRenderAndRun(source, shouldMount) {
    const programConstructor = this.getProgramConstructorForTab()
    this._program = new programConstructor(source)
    this._program.saveVersion()
    this._program.setTab(this)

    if (shouldMount) this._getPanel().setMountedTab(this)

    this.getRootNode().renderApp()
    await this._program.loadAndIncrementalRender()
    return this
  }

  async reloadFromDisk() {
    const source = await this.getRootNode().readFile(this.getFullTabFilePath())
    return this.autosaveAndReloadWith(source)
  }

  async _fetchTabInitProgramRenderAndRun(shouldMount) {
    const source = await this.getRootNode().readFile(this.getFullTabFilePath())
    const res = await this._initProgramRenderAndRun(source, shouldMount)
    return res
  }

  async autosaveTab() {
    this.getTabProgram().saveVersion()
    const app = this.getRootNode()
    if (!app.isAutoSaveEnabled()) return undefined

    await this.forceSaveToFile()
    this.addStumpCodeMessageToLog(`div Saved ${this.getFileName()}
 title Saved ${this.getFullTabFilePath()}`)
  }

  forceSaveToFile() {
    const newVersion = this.getTabProgram().toString()
    return this.getRootNode().writeFile(this.getFullTabFilePath(), newVersion)
  }

  getFullTabFilePath() {
    return this.getWordsFrom(1).join(" ")
  }

  getFileName() {
    return jtree.Utils.getFileName(this.getFullTabFilePath())
  }

  getProgramConstructorForTab() {
    return this.getRootNode().getProgramConstructorFromFileExtension(jtree.Utils.getFileExtension(this.getFullTabFilePath()))
  }

  getTabWall() {
    return this.getParent().getWall()
  }

  async appendFromPaste(pastedText) {
    const tabProgram = this.getTabProgram()
    const newNodes = tabProgram.concat(pastedText)
    const newTiles = newNodes.filter(tile => tile.doesExtend && tile.doesExtend("abstractTileTreeComponentNode"))
    this.addStumpCodeMessageToLog(`div Pasted ${newTiles.length} nodes`)
    await this.autosaveTab()
    tabProgram.clearSelection()
    this.getTabWall().unmount()

    // todo: catch if a tile throws so that we still render the terminal.
    await tabProgram.loadAndIncrementalRender()
    newTiles.forEach(tile => tile.selectTile())
  }

  getTabProgram() {
    return this._program
  }

  async unlinkTab() {
    return this.getRootNode().unlinkFile(this.getFullTabFilePath())
  }
}

module.exports = TabTreeComponent
