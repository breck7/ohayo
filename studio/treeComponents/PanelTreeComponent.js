const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const { FullDiskPath } = require("../storage/FilePaths.js")

const StudioConstants = require("./StudioConstants.js")
const TabsTreeComponent = require("./TabsTreeComponent.js")
const GutterTreeComponent = require("./GutterTreeComponent.js")

class PanelTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      tabs: TabsTreeComponent,
      gutter: GutterTreeComponent
    })
  }

  toggleGutter() {
    // todo: this is UI buggy! toggling resets scroll states
    const gutter = this.getNode(StudioConstants.gutter)
    if (gutter) gutter.unmountAndDestroy()
    else {
      const node = this.touchNode(StudioConstants.gutter)
      node.appendLine(StudioConstants.terminal)
      node.appendLine(StudioConstants.console)
    }
  }

  toHakonCode() {
    const menuHeight = this.getParent().getMenuTreeComponent() ? "30" : "0"
    return `.PanelTreeComponent
 position relative
 left 0
 right 0
 bottom 0
 height calc(100% - ${menuHeight}px)`
  }

  getGutterWidth() {
    return parseInt(this.getWord(1))
  }

  setGutterWidth(newWidth) {
    return this.setWord(1, newWidth)
  }

  toggleGutterWidth() {
    this.setGutterWidth(this.getGutterWidth() === 50 ? 400 : 50)
    return this
  }

  mountTabByIndex(index) {
    this.setMountedTab(this.getTabs()[index])
    this.getRootNode().renderApp()
    return this
  }

  getMountedTab() {
    return this._getMountedTab()
  }

  _getMountedTab() {
    return this._focusedTab
  }

  getOpenTabByFullFilePath(fullPath) {
    return this.getTabs().find(tab => tab.getFullTabFilePath() === fullPath)
  }

  setMountedTabName(tabName) {
    if (tabName) this.setWord(2, tabName)
    else this.deleteWordAt(2)
  }

  getMountedTabName() {
    return this.getWord(2)
  }

  setMountedTab(tab) {
    const currentTab = this._getMountedTab()
    if (currentTab === tab) return this
    else if (currentTab) this._getTabsNode().removeWall()
    this._focusedTab = tab
    this.setMountedTabName(tab.getFullTabFilePath())
    const wallType = tab.getTabProgram().wallType
    this._getTabsNode().addWall(wallType)
    this._updateLocationForRestoreOnRefresh()
    return this
  }

  _getTabsNode() {
    return this.getNode("tabs")
  }

  async getAlreadyOpenTabOrOpenFullFilePathInNewTab(filePath, andMount = false) {
    const existingTab = this.getOpenTabByFullFilePath(new FullDiskPath(filePath).toString())
    if (existingTab) {
      if (andMount) {
        this.setMountedTab(existingTab)
        this.getRootNode().renderApp()
      }
      return existingTab
    }

    const tab = this._getTabsNode().addTab(new FullDiskPath(filePath).toString())

    await tab._fetchTabInitProgramRenderAndRun(andMount)

    this.getRootNode().renderApp()
    return tab
  }

  closeTabByIndex(index) {
    return this.closeTab(this.getTabs()[index])
  }

  closeTab(tab) {
    if (tab.isMounted()) {
      const tabToMountNext = jtree.Utils.getNextOrPrevious(this.getTabs())
      this._getTabsNode().removeWall()
      tab.unmountAndDestroy()
      delete this._focusedTab
      if (tabToMountNext) this.setMountedTab(tabToMountNext)
      else this.setMountedTabName()
    } else tab.destroy()
    this._updateLocationForRestoreOnRefresh()
  }

  _updateLocationForRestoreOnRefresh() {
    this.getRootNode().saveAppState()
  }

  closeAllTabs() {
    this._getTabsNode()
      .getOpenTabs()
      .forEach(tab => {
        this.closeTab(tab)
      })
  }

  closeAllTabsExceptFocusedTab() {
    const mountedTab = this.getMountedTab()
    this._getTabsNode()
      .getOpenTabs()
      .forEach(tab => {
        if (tab !== mountedTab) this.closeTab(tab)
      })
  }

  mountPreviousTab() {
    const tabs = this.getTabs()
    const mountedTab = this._getMountedTab()
    if (tabs.length < 2 || !mountedTab) return this
    const index = tabs.indexOf(mountedTab)
    return this.mountTabByIndex(index === 0 ? tabs.length - 1 : index - 1)
  }

  mountNextTab() {
    const tabs = this.getTabs()
    const mountedTab = this._getMountedTab()
    if (tabs.length < 2 || !mountedTab) return this
    const index = tabs.indexOf(mountedTab)
    return this.mountTabByIndex(index === tabs.length - 1 ? 0 : index + 1)
  }

  getTabs() {
    return this._getTabsNode().getOpenTabs()
  }
}

module.exports = PanelTreeComponent
