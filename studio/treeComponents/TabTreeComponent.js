const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

/*NODE_JS_ONLY*/ const ohayoNode = require("../../ohayo/ohayo.nodejs.js")

const StudioConstants = require("./StudioConstants.js")
const OhayoConstants = require("../treeComponents/OhayoConstants.js")

const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")

class TabMenuTreeComponent extends AbstractContextMenuTreeComponent {
  getContextMenuBodyStumpCode() {
    const index = this.getWord(1)
    return `a Save File
 clickCommand saveTabAndNotifyCommand
a Close File
 clickCommand closeTabByIndexCommand
 value ${index}
a Rename File
 clickCommand showTabRenameFilePromptCommand
a Move File
 clickCommand showTabMoveFilePromptCommand
a Clone File
 clickCommand cloneTabCommand
a Delete File
 clickCommand showDeleteFileConfirmDialogCommand
a Copy program as link
 clickCommand copyDeepLinkCommand
a Log program stats
 clickCommand printProgramStatsCommand
a Close all other files
 clickCommand closeAllTabsExceptFocusedTabCommand`
  }
}

class TabTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    const app = this.getRootNode()
    const index = this.getIndex()
    const fullPath = this.getFullTabFilePath()
    const filename = this.getFileName()
    const isMounted = app.getMountedTabName() === fullPath
    return `a ${filename}
 clickCommand mountTabByIndexCommand
 collapse
 value ${index}
 title ${fullPath}
 id tab${index}
 class TabStub ${isMounted ? "mountedTab" : ""}
 span ▾
  collapse
  clickCommand openTabMenuCommand
  value ${index}
  class tabDropDownButton`
  }

  toHakonCode() {
    return `.TabStub
 .tabDropDownButton
  opacity 0
 &:hover
  .tabDropDownButton
   cursor pointer
   opacity 1
.TabStub.mountedTab
 .tabDropDownButton
  opacity 1`
  }

  async openTabMenuCommand() {
    const index = this.getIndex()
    this.getRootNode().toggleAndRender(`${StudioConstants.tabMenu} ${index}`)
  }

  getDeepLink() {
    const obj = {}
    obj[StudioConstants.deepLinks.filename] = this.getFileName()
    return this.getRootNode()
      .getWillowBrowser()
      .toPrettyDeepLink(this.getTabProgram().childrenToString(), obj)
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

  async _initProgramRenderAndRun(source, shouldMount) {
    this._program = new ohayoNode(source)
    this._program.saveVersion()
    this._program.setTab(this)
    const app = this.getRootNode()

    if (shouldMount) app.setMountedTab(this)

    app.renderApp()
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

  getTabWall() {
    return this.getRootNode().getAppWall()
  }

  async appendFromPaste(pastedText) {
    const tabProgram = this.getTabProgram()
    const newNodes = tabProgram.concat(pastedText)
    const newTiles = newNodes.filter(tile => tile.doesExtend && tile.doesExtend(OhayoConstants.abstractTileTreeComponentNode))
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

module.exports = { TabTreeComponent, TabMenuTreeComponent }
