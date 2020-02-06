const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const { FullDiskPath } = require("../storage/FilePaths.js")

const StudioConstants = require("./StudioConstants.js")
const OhayoConstants = require("../treeComponents/OhayoConstants.js")

const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")

/*NODE_JS_ONLY*/ const ohayoNode = require("../../ohayo/ohayo.nodejs.js")

class TabMenuTreeComponent extends AbstractContextMenuTreeComponent {
  getContextMenuBodyStumpCode() {
    const tabId = this.getWord(1)
    return `a Save File
 clickCommand saveTabAndNotifyCommand
 value ${tabId}
a Close File
 clickCommand closeTabCommand
 value ${tabId}
a Rename File
 clickCommand showTabRenameFilePromptCommand
 value ${tabId}
a Move File
 clickCommand showTabMoveFilePromptCommand
 value ${tabId}
a Clone File
 clickCommand cloneTabCommand
 value ${tabId}
a Delete File
 clickCommand showDeleteFileConfirmDialogCommand
 value ${tabId}
a Copy program as link
 clickCommand copyTabDeepLinkCommand
 value ${tabId}
a Log program stats
 clickCommand printProgramStatsCommand
 value ${tabId}
a Close all other files
 clickCommand closeAllTabsExceptThisOneCommand
 value ${tabId}`
  }
}

class TabsTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      tab: TabTreeComponent
    })
  }

  getOpenTabs() {
    return this.getChildrenByNodeConstructor(TabTreeComponent)
  }

  insertTab(url, tabIndex) {
    return this.insertLine(`tab unmounted ${new FullDiskPath(url).toString()}`, tabIndex)
  }

  toHakonCode() {
    const theme = this.getTheme()
    // todo: add comments to Hakon? So we can annotate why we have valignTop
    const valignTop = "vertical-align top" // https://stackoverflow.com/questions/23529369/why-does-x-overflowhidden-cause-extra-space-below
    // todo: make tab cell width dynamic? smaller as more tabs open?s

    return `.TabsTreeComponent
 display inline-block
.TabStub
 height 30px
 display inline-block
 max-width 150px
 text-overflow ellipsis
 white-space nowrap
 ${valignTop}
 overflow-x hidden
 box-sizing border-box
 position relative
 font-size 13px
 padding 0 15px
 color ${theme.menuTreeComponentColor}
 line-height 30px
 border-right 1px solid rgba(0,0,0,.2)
 &:hover
  background rgba(0,0,0,.1)
 &:active
  background rgba(0,0,0,.2)
 span
  position absolute
  top 10px
  right 5px
  display block
  font-size 12px
  line-height 10px
  text-align center
  opacity .25
  &:hover
   opacity 1
 &.mountedTab
  background rgba(0,0,0,.2)
  border-bottom 0`
  }
}

class TabTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    const app = this.getRootNode()
    const index = this.getIndex()
    const fullPath = this.getFullTabFilePath()
    const filename = this.getFileName()
    const tabId = this._getUid()
    const filenameWithoutExtension = jtree.Utils.removeFileExtension(filename)
    return `a ${filenameWithoutExtension}
 clickCommand mountTabCommand
 collapse
 value ${tabId}
 title ${fullPath}
 id tab${index}
 class TabStub ${this.isMountedTab() ? "mountedTab" : ""}
 span ▾
  collapse
  clickCommand openTabMenuCommand
  value ${tabId}
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

  async openTabMenuCommand(tabId) {
    this.getRootNode().toggleAndRender(`${StudioConstants.tabMenu} ${tabId}`)
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
    return this.getWordsFrom(2).join(" ")
  }

  getFileName() {
    return jtree.Utils.getFileName(this.getFullTabFilePath())
  }

  getTabWall() {
    return this.getRootNode().getAppWall()
  }

  isMountedTab() {
    return this.getWord(1) === "mounted"
  }

  markAsUnmounted() {
    this.setWord(1, "unmounted")
    return this
  }

  markAsMounted() {
    this.setWord(1, "mounted")
    return this
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

module.exports = { TabsTreeComponent, TabMenuTreeComponent }
