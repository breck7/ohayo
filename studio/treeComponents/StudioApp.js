const lodash = require("lodash")
const { jtree } = require("jtree")
const moment = require("moment")
const { AbstractTreeComponent, TreeComponentFrameworkDebuggerComponent } = require("jtree/products/TreeComponentFramework.node.js")

const { FullFilePath, FullFolderPath, FullDiskPath, FileHandle } = require("../storage/FilePaths.js")
const LocalStorageDisk = require("../storage/LocalStorageDisk.js")
const ServerStorageDisk = require("../storage/ServerStorageDisk.js")
const StorageKeys = require("../storage/StorageKeys.js")

const ThemeTreeComponent = require("../themes/ThemeTreeComponent.js")
const Version = require("./Version.js")

/*NODE_JS_ONLY*/ const ohayoNode = require("../../ohayo/ohayo.nodejs.js")

const DemoTemplates = require("../templates/DemoTemplates.js")

const PanelTreeComponent = require("./PanelTreeComponent.js")
const MenuTreeComponent = require("./MenuTreeComponent.js")
const AbstractModalTreeComponent = require("./AbstractModalTreeComponent.js")

const StudioConstants = require("./StudioConstants.js")
const HelpModal = require("./HelpModal.js")

const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")
const { TabMenuTreeComponent } = require("./TabTreeComponent.js")

const OhayoConstants = require("../treeComponents/OhayoConstants.js")

const OhayoCodeEditorTemplate = require("../templates/OhayoCodeEditorTemplate.js")
const MiniTemplate = require("../templates/MiniTemplate.js")
const SpeedTestTemplate = require("../templates/SpeedTestTemplate.js")
const OhayoTemplates = require("../templates/OhayoTemplates.js")

class GlobalShortcutNode extends jtree.TreeNode {
  getKeyCombo() {
    return this.getWord(3)
  }

  getFn() {
    return this.getWord(2)
  }

  getCategory() {
    return this.getWord(1)
  }

  getDescription() {
    return this.getWordsFrom(4).join(" ")
  }

  isEnabled() {
    return true
  }

  execute(app) {
    if (!this.isEnabled(app)) return false
    const fn = this.getFn()
    app.addToCommandLog(fn)
    app[fn]()
  }
}

class MountedShortcutNode extends GlobalShortcutNode {
  isEnabled(app) {
    return !!app.getMountedTab()
  }
}

class DrumsProgram extends jtree.TreeNode {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      panel: GlobalShortcutNode,
      mounted: MountedShortcutNode
    })
  }
}

class StudioApp extends AbstractTreeComponent {
  treeComponentWillMount() {
    this._startVisitCounter()
    const state = this.getFromStore(StorageKeys.appState)
    if (state) this.setChildren(state)

    this._restoreTabs()

    this._makeProgramLinksOpenImmediately()
    this._makeDocumentCopyableAndCuttable()
    this._bindKeyboardShortcuts()

    const willowDoc = this.getWillowBrowser()

    willowDoc.setResizeEndHandler(event => this._onResizeEndEvent(event))
    willowDoc.setPasteHandler(event => this._onPasteEvent(event))
    willowDoc.setLoadedDroppedFileHandler(files => {
      files.forEach(file => this.createProgramFromFileCommand(file.filename, file.data))
    }, "Drop to create a new program.")

    this._setErrorHandlers()
    this.addStumpCodeMessageToLog(`div Ohayo!`)

    const deepLink = this._getDeepLink()
    if (deepLink) this.createAndOpenNewProgramFromDeepLinkCommand(deepLink)
    else if (this._getVisitCount() === 1) this.playFirstVisitCommand()
  }

  _getDeepLink() {
    if (this.isNodeJs()) return false
    return window.location.href.includes(StudioConstants.deepLinks.filename) ? window.location.href : ""
  }

  async _onPasteEvent(event) {
    // Return true if worker is editing an input
    if (this.terminalHasFocus() || this.getWillowBrowser().someInputHasFocus()) return true
    if (event.clipboardData && event.clipboardData.getData) await this.pasteCommand(event.clipboardData.getData("text/plain"))
  }

  _onResizeEndEvent(event) {
    this.touchNode(StudioConstants.windowSize).setContent(`${event.width} ${event.height}`)
    delete this._bodyShadowDimensionsCache
    this.renderApp()
  }

  _restoreTabs() {
    const tabToMount = this.getMountedTabName()
    this.getTabs().forEach(async tab => {
      await tab._fetchTabInitProgramRenderAndRun(tab.getFullTabFilePath() === tabToMount)
      this.renderApp()
    })
  }

  _getProjectRootDir() {
    return this.isNodeJs() ? jtree.Utils.findProjectRoot(__dirname, "ohayo") : ""
  }

  terminalHasFocus() {
    const terminalNode = this.getPanel().getNode(`${StudioConstants.gutter} ${StudioConstants.terminal}`)
    return terminalNode && terminalNode.hasFocus()
  }

  initLocalDataStorage(key, value) {
    key = jtree.Utils.stringToPermalink(key)
    key = this.getUnusedStoreKey(key)
    this.getRootNode().storeValue(key, value)
    return key
  }

  getBodyShadowDimensions() {
    if (!this._bodyShadowDimensionsCache) this._bodyShadowDimensionsCache = this._getBodyShadowDimensions()
    return this._bodyShadowDimensionsCache
  }

  _getBodyShadowDimensions() {
    // depends on window.resize and whether gutter is open

    const bodyStumpNode = this.getWillowBrowser().getBodyStumpNode()
    const bodyShadow = bodyStumpNode.getShadow()

    return {
      width: bodyShadow.getShadowWidth(),
      height: bodyShadow.getShadowHeight()
    }
  }

  getWindowSizeMTime() {
    const node = this.getNode(StudioConstants.windowSize)
    return node ? node.getLineModifiedTime() : 0
  }

  static getDefaultStartState() {
    return `${StudioConstants.theme} ${ThemeTreeComponent.defaultTheme}
${StudioConstants.menu}
 logo
 tabs
 newButton
${StudioConstants.panel} 400
 ${StudioConstants.gutter}
  ${StudioConstants.terminal}
  ${StudioConstants.console}`
  }

  saveAppState() {
    this.storeValue(StorageKeys.appState, this.toString())
  }

  resetAppState() {
    this.removeValue(StorageKeys.appState)
    return this
  }

  executeCommandLine(args) {
    this.addToCommandLog(args.join(" "))
    return this[args[0]].apply(this, args.slice(1))
  }

  getOhayoGrammarAsTree() {
    if (!this._ohayoGrammarTree) this._ohayoGrammarTree = new ohayoNode().getHandGrammarProgram()
    return this._ohayoGrammarTree
  }

  getTargetNode() {
    return this._targetNode
  }

  setTargetNode(node) {
    this._targetNode = node
    return this
  }

  getVersion() {
    return Version
  }

  getDefinitionLoadingPromiseMap() {
    if (!this._loadingPromiseMap) this._loadingPromiseMap = new Map()
    return this._loadingPromiseMap
  }

  _startVisitCounter() {
    let visitCount = this._getVisitCount()

    visitCount++
    this.setVisitCount(visitCount)
  }

  setVisitCount(visitCount) {
    // exposed for unit testing
    this.storeValue(StorageKeys.visitCount, visitCount)
  }

  _getVisitCount() {
    const visitCountStr = this.getFromStore(StorageKeys.visitCount)
    return visitCountStr ? parseInt(visitCountStr) : 0
  }

  createParser() {
    const map = {}
    map[StudioConstants.tabMenu] = TabMenuTreeComponent
    map[StudioConstants.panel] = PanelTreeComponent
    map[StudioConstants.menu] = MenuTreeComponent
    map[StudioConstants.theme] = ThemeTreeComponent
    map[StudioConstants.helpModal] = HelpModal
    map["TreeComponentFrameworkDebuggerComponent"] = TreeComponentFrameworkDebuggerComponent

    return new jtree.TreeNode.Parser(jtree.TreeNode, map)
  }

  toHakonCode() {
    const theme = this.getTheme()
    return `.StudioApp
 height 100%
 width 100%
.OhayoError
 color ${theme.errorColor}`
  }

  isConnectedToStudioServerApp() {
    return typeof isConnectedToStudioServerApp !== "undefined"
  }

  isUrlGetProxyAvailable() {
    return this.isConnectedToStudioServerApp()
  }

  goRed(err) {
    const tab = this.getMountedTab()
    const message = err ? err.reason || err : ""
    if (tab) tab.addStumpErrorMessageToLog(`Error: ${message}.`)
    else this.addStumpErrorMessageToLog(`Error on tab: ${tab ? tab.getFullTabFilePath() : ""}: ${message}`)
    this.renderApp()
  }

  _setErrorHandlers() {
    const that = this
    this.getWillowBrowser().setErrorHandler((message, file, line) => {
      that.goRed(message)
      console.error(message)
    })
  }

  closeModal() {
    this.getOpenModals().forEach(node => node.unmountAndDestroy())
  }

  getOpenModals() {
    return this.filter(node => node instanceof AbstractModalTreeComponent)
  }

  closeAllContextMenus() {
    this.filter(node => node instanceof AbstractContextMenuTreeComponent).forEach(node => node.unmountAndDestroy())
  }

  // todo: delete this
  makeAllDirty() {
    this.getTopDownArray()
      .filter(child => child instanceof AbstractTreeComponent)
      .forEach(child => {
        child._setLastRenderedTime(0)
      })
  }

  renderApp() {
    const report = this.renderAndGetRenderReport(this.getWillowBrowser().getBodyStumpNode())
    // console.log(report.toString())
    // console.log(this.toString())
  }

  _appendTiles(line, children) {
    return this.getNodeCursors().map(cursor => cursor.appendLineAndChildren(line, children))
  }

  getNodeCursors() {
    const tilesProgram = this.getMountedTilesProgram()
    const selectedNodes = tilesProgram.getSelectedNodes()
    return selectedNodes.length ? selectedNodes : [tilesProgram]
  }

  async _openOhayoProgram(name) {
    const disk = this.getDefaultDisk()
    const fullPath = disk.getPathBase() + name
    const openTab = this.getOpenTabByFullFilePath(fullPath)

    if (openTab) {
      this.setMountedTab(openTab)
      return undefined
    }

    const fullDiskFilePath = new FullDiskPath(fullPath)

    const result = await disk.exists(fullDiskFilePath.getFilePath())
    if (result) return this.openFullPathInNewTabAndFocus(fullPath)

    return this._createAndOpen(new jtree.TreeNode(DemoTemplates).getNode(name).childrenToString(), name)
  }

  async createFileOnDefaultDisk(filename, sourceStr) {
    const disk = this.getDefaultDisk()
    const permalink = jtree.Utils.stringToPermalink(filename)
    const newName = await disk.getAvailablePermalink(permalink)

    await disk.writeFile(newName, sourceStr)
    return disk.getDisplayName() + newName
  }

  async _createAndOpen(sourceStr, filename) {
    const newName = await this.createFileOnDefaultDisk(filename, sourceStr)
    const res = await this.openFullPathInNewTabAndFocus(newName)
    return res
  }

  setMountedTab(tab) {
    const currentTab = this._getMountedTab()
    if (currentTab === tab) return this
    else if (currentTab) this.getPanel().removeWall()
    this._focusedTab = tab
    this.setMountedTabName(tab.getFullTabFilePath())
    this.getPanel().addWall()
    this._updateLocationForRestoreOnRefresh()
    return this
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

  _updateLocationForRestoreOnRefresh() {
    this.saveAppState()
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

  getOpenTabByFullFilePath(fullPath) {
    return this.getTabs().find(tab => tab.getFullTabFilePath() === fullPath)
  }

  setMountedTabName(tabName) {
    if (tabName) this.set("mountedFile", tabName)
    else this.delete("mountedFile")
  }

  getMountedTabName() {
    return this.get("mountedFile")
  }

  getPanel() {
    return this.getNode(StudioConstants.panel)
  }

  getMountedTilesProgram() {
    const mountedTab = this.getMountedTab()
    return mountedTab && mountedTab.getTabProgram()
  }

  getMenuTreeComponent() {
    return this.getNode(StudioConstants.menu)
  }

  async _openFullDiskFilePathInNewTab(fullDiskFilePath) {
    const res = await this.getAlreadyOpenTabOrOpenFullFilePathInNewTab(new FullDiskPath(fullDiskFilePath).toString())
    return res
  }

  async openFullPathInNewTabAndFocus(fullDiskFilePath) {
    const tab = await this.getAlreadyOpenTabOrOpenFullFilePathInNewTab(new FullDiskPath(fullDiskFilePath).toString(), true)
    return tab
  }

  isAutoSaveEnabled() {
    return this.getFromStore(StorageKeys.autoSave) !== "false"
  }

  getThemeName() {
    return this.get(StudioConstants.theme)
  }

  isGlassTheme() {
    const name = this.getThemeName()
    return name === ThemeTreeComponent.ThemeConstants.glass || name === ThemeTreeComponent.ThemeConstants.clearGlass
  }

  getTheme() {
    return ThemeTreeComponent.Themes[this.getThemeName()] || ThemeTreeComponent.Themes.glass
  }

  _toggleTheme() {
    const newThemeName = jtree.Utils.toggle(this.getThemeName(), Object.keys(ThemeTreeComponent.Themes))
    this.addStumpCodeMessageToLog(`div Switched to ${newThemeName} theme`)
    this.set(StudioConstants.theme, newThemeName)
    this.saveAppState()
    this.makeAllDirty() // todo:remove
    this.renderApp()
  }

  async promptToMoveFile(existingFullDiskFilePath, suggestedNewFilename, isRenameOp = false) {
    const path = new FullDiskPath(existingFullDiskFilePath)
    const suggestedFullDiskFilePath = suggestedNewFilename ? path.getWithoutFilename() + suggestedNewFilename : existingFullDiskFilePath

    let newFullDiskFilePath

    if (isRenameOp) {
      const newNameOnly = await this.getWillowBrowser().promptThen("Enter new name for file", suggestedNewFilename || path.getFilename())
      newFullDiskFilePath = newNameOnly ? path.getWithoutFilename() + newNameOnly : newNameOnly
    } else newFullDiskFilePath = await this.getWillowBrowser().promptThen("Enter new name for file", suggestedFullDiskFilePath || existingFullDiskFilePath)

    if (!newFullDiskFilePath || newFullDiskFilePath === existingFullDiskFilePath) return undefined

    newFullDiskFilePath = new FullDiskPath(newFullDiskFilePath)

    newFullDiskFilePath = newFullDiskFilePath.getWithoutFilename() + jtree.Utils.stringToPermalink(newFullDiskFilePath.getFilename())
    if (!newFullDiskFilePath) return undefined
    const resultingName = await this.moveFileCommand(existingFullDiskFilePath, newFullDiskFilePath)

    this.addStumpCodeMessageToLog(`div Moved`)
    return resultingName
  }

  getKeyboardShortcuts() {
    if (!this._shortcuts)
      this._shortcuts = new DrumsProgram(
        typeof StudioDrums === "undefined" ? jtree.TreeNode.fromDisk(this._getProjectRootDir() + "studio/treeComponents/Studio.drums") : new jtree.TreeNode(StudioDrums)
      )
    return this._shortcuts
  }

  _getMousetrap() {
    return this.getWillowBrowser().getMousetrap()
  }

  _bindKeyboardShortcuts() {
    const mouseTrap = this._getMousetrap()
    const willowBrowser = this.getWillowBrowser()

    mouseTrap._originalStopCallback = mouseTrap.prototype.stopCallback
    mouseTrap.prototype.stopCallback = function(evt, element, shortcut) {
      const stumpNode = willowBrowser.getStumpNodeFromElement(element)
      if (stumpNode && shortcut === "command+s" && stumpNode.stumpNodeHasClass("savable")) {
        stumpNode.getShadow().triggerShadowEvent("change")
        evt.preventDefault()
        return true
      }
      if (mouseTrap._pause) return true
      return mouseTrap._originalStopCallback.call(this, evt, element)
    }

    const app = this

    this.getKeyboardShortcuts().forEach(shortcut => {
      const keyCombo = shortcut.getKeyCombo()
      if (!keyCombo) return true
      mouseTrap.bind(keyCombo, function(evt) {
        shortcut.execute(app)
        // todo: handle the below when we need to
        if (evt.preventDefault) evt.preventDefault()
        return false
      })
    })
  }

  pauseShortcutListener() {
    this._getMousetrap()._pause = true
  }

  resumeShortcutListener() {
    this._getMousetrap()._pause = false
  }

  getStore() {
    return this.getWillowBrowser().getStore()
  }

  getUnusedStoreKey(key) {
    return jtree.Utils.getAvailablePermalink(key, key => this.getFromStore(key) !== undefined)
  }

  getStoreKeys() {
    const prefix = this.constructor.name
    const prefixLength = prefix.length
    const keys = []
    this.getStore().each((value, key) => {
      if (key.startsWith(prefix)) keys.push(key.substr(prefixLength))
    })
    return keys
  }

  dumpStore() {
    this.getStore().each((value, key) => {
      console.log(key)
    })
    return this
  }

  getStoreDiskUsage() {
    // todo: is there a way to do this?
    let bytes = 0
    this.getStore().each((value, key) => {
      bytes += value.toString().length + key.toString().length
    })
    return bytes / 5000000
  }

  getFromStore(key) {
    return this.getStore().get(this.constructor.name + key.toString())
  }

  storeValue(key, value) {
    // todo: handle quotaexceeded
    return this.getStore().set(this.constructor.name + key.toString(), value)
  }

  removeValue(key) {
    return this.getStore().remove(this.constructor.name + key.toString())
  }

  _makeDocumentCopyableAndCuttable() {
    const app = this
    this.getWillowBrowser()
      .setCopyHandler(evt => app.copySelectionCommand(evt))
      .setCutHandler(evt => app.cutSelectionCommand(evt))
  }

  _handleLinkClick(stumpNode, evt) {
    if (!stumpNode) return undefined
    const link = stumpNode.getStumpNodeAttr("href")
    if (!link || stumpNode.getStumpNodeAttr("target")) return undefined
    evt.preventDefault()
    if (this.getWillowBrowser().isExternalLink(link)) {
      this.openExternalLink(link)
      return false
    }
  }

  openExternalLink(link) {
    this.getWillowBrowser().openUrl(link)
  }

  getAppWall() {
    return this.getPanel().getWall()
  }

  // for tests
  getRenderedTilesDiagnostic() {
    return this.getMountedTilesProgram()
      .getTiles()
      .filter(tile => tile.isVisible() && tile.isMounted())
  }

  // for tests
  getMountedTilesDiagnostic() {
    return jtree.Utils.flatten(
      this._getTabsNode()
        .getOpenTabs()
        .map(tab =>
          tab
            .getTabProgram()
            .getTiles()
            .filter(tile => tile.isMounted())
        )
    )
  }

  async _createProgramFromPaste(pastedText) {
    await this._createAndOpen(pastedText, `untitled${StudioConstants.ohayoExtension}`) // todo: guess language!
  }

  // for tests and debugging
  // todo: only relevant for OhayoTiles with tables
  dumpTablesDiagnostic() {
    return this.getRenderedTilesDiagnostic().forEach(tile => {
      console.log(tile.getLine())
      console.log(tile.getOutputOrInputTable())
    })
  }

  getDisks() {
    if (!this._disks) this._mountDisks()
    return this._disks
  }

  writeFile(fullDiskFilePath, newVersion) {
    return new FileHandle(fullDiskFilePath, this).writeFile(newVersion)
  }

  readFile(fullDiskFilePath) {
    return new FileHandle(fullDiskFilePath, this).readFile()
  }

  unlinkFile(fullDiskFilePath) {
    return new FileHandle(fullDiskFilePath, this).unlinkFile()
  }

  async moveFile(existingFullDiskFilePath, newFullDiskFilePath) {
    const content = await this.readFile(existingFullDiskFilePath)
    // Todo: check to make sure we arent overwriting
    // Todo: check to make sure things worked before unlinking.
    await this.writeFile(newFullDiskFilePath, content)
    await this.unlinkFile(existingFullDiskFilePath)
    return newFullDiskFilePath
  }

  _mountDisks() {
    this._disks = {}
    const localDisk = new LocalStorageDisk(this)
    this._defaultDisk = localDisk
    this._disks[localDisk.getDisplayName()] = localDisk
    const addServerDisk = this.isNodeJs() ? false : this.isConnectedToStudioServerApp()
    let serverDisk
    if (addServerDisk) {
      serverDisk = new ServerStorageDisk(this)
      this._disks[serverDisk.getDisplayName()] = serverDisk
    }

    const cwd = typeof DefaultServerCurrentWorkingDirectory === "undefined" ? "/" : DefaultServerCurrentWorkingDirectory
    const workingFolder = this.getFromStore(StorageKeys.workingFolderFullDiskFolderPath)
    if (workingFolder) this.setWorkingFolder(workingFolder)
    else this.setWorkingFolder(addServerDisk ? serverDisk.getDisplayName() + cwd : localDisk.getDisplayName() + "/")
  }

  setWorkingFolder(newWorkingFolder) {
    const path = new FullFolderPath(newWorkingFolder)
    this.setDefaultDisk(path.getDiskId())
    this.getDefaultDisk().setFolder(path.getFolderPath())

    this.storeValue(StorageKeys.workingFolderFullDiskFolderPath, newWorkingFolder)
  }

  getDefaultDisk() {
    const disks = this.getDisks()
    return this._defaultDisk
  }

  setDefaultDisk(id) {
    if (!this._disks[id]) throw new Error(`Disk ${id} not found.`)
    this._defaultDisk = this._disks[id]
    return this
  }

  // todo: remove this crap?
  _makeProgramLinksOpenImmediately() {
    const app = this
    const willowBrowser = this.getWillowBrowser()
    willowBrowser
      .getBodyStumpNode()
      .getShadow()
      .onShadowEvent("click", "a", function(evt) {
        app._handleLinkClick(willowBrowser.getStumpNodeFromElement(this), evt)
      })
  }

  _onCommandWillRun() {
    this.closeAllContextMenus() // todo: move these to a body handler?
    this.closeAllDropDownMenusCommand()
  }

  async _executeCommandByStumpNodeChild(commandName, stumpNodeChild) {
    const willowBrowser = this.getWillowBrowser()
    const stumpNode = willowBrowser.getBodyStumpNode().findStumpNodeByChild(stumpNodeChild)
    await this._executeCommandOnStumpNode(stumpNode, stumpNode.getStumpNodeAttr(commandName))
  }

  async _executeCommandByStumpNodeString(commandName, str) {
    const willowBrowser = this.getWillowBrowser()
    const stumpNode = willowBrowser.getBodyStumpNode().findStumpNodeByChildString(str)
    await this._executeCommandOnStumpNode(stumpNode, stumpNode.getStumpNodeAttr(commandName))
  }

  async playFirstVisitCommand() {
    // await this.openOhayoProgramCommand("faq.ohayo")
    // todo: make this create in memory?
    await this.openOhayoProgramCommand(StudioConstants.productName + StudioConstants.ohayoExtension)
  }

  copyTargetTileCommand(uno, dos) {
    return this.getTargetNode().copyTileCommand(uno, dos)
  }

  copyTargetTileDataAsTreeCommand(uno, dos) {
    return this.getTargetNode().copyDataAsTreeCommand(uno, dos)
  }

  copyTargetTileDataAsJavascriptCommand(uno, dos) {
    return this.getTargetNode().copyDataAsJavascriptCommand(uno, dos)
  }

  copyTargetTileDataCommand(uno, dos) {
    return this.getTargetNode().copyDataCommand(uno, dos)
  }

  exportTargetTileDataCommand(uno, dos) {
    return this.getTargetNode().exportTileDataCommand(uno, dos)
  }

  async cellCheckProgramCommand() {
    const program = this.mountedTab.getTabProgram()
    const errors = program.getAllErrors().map(err => err.getMessage())
    if (errors.length)
      this.mountedTab.addStumpCodeMessageToLog(
        `div ${errors.length} errors in ${this.mountedTab.getFileName()}
 class OhayoError
 div - ${errors.join("\n div - ")}`
      )
    else this.mountedTab.addStumpCodeMessageToLog(`div 0 errors in ${this.mountedTab.getFileName()}`)
    this.renderApp()
  }

  async printProgramStatsCommand() {
    const stats = new jtree.TreeNode(this.mountedProgram.toRunTimeStats()).toString()
    this.mountedTab.logMessageText(stats)
    this.renderApp()
  }

  createProgramFromFileCommand(filename, data) {
    // todo: how do we handle multi-table-csv?
    // there are multiple types of CSVs.
    const extension = jtree.Utils.getFileExtension(filename)
    if (extension === StudioConstants.ohayoExtension) return this._createAndOpen(data, filename)

    const templateFn = OhayoTemplates[extension]
    const program = templateFn ? templateFn(filename, data, this) : `html.h1 No visualization templates for ${filename}`
    return this._createAndOpen(program, filename + StudioConstants.ohayoExtension)
  }

  async toggleShadowByIdCommand(id) {
    this.willowBrowser
      .getBodyStumpNode()
      .findStumpNodeByChild("id " + id)
      .getShadow()
      .toggleShadow()
  }

  async fillShadowInputOrTextAreaByClassNameCommand(className, value) {
    this.willowBrowser
      .getBodyStumpNode()
      .findStumpNodesWithClass(className)
      .forEach(stumpNode => {
        stumpNode.getShadow().setInputOrTextAreaValue(value)
      })
  }

  async openDeleteAllTabsPromptCommand() {
    const tabs = this.getTabs()

    const shouldProceed = await this.willowBrowser.confirmThen(`Are you sure you want to delete ${tabs.length} open files?`)

    return shouldProceed ? Promise.all(tabs.map(tab => tab.unlinkTab())) : false
  }

  async closeAllDropDownMenusCommand() {
    this.getTopDownArray().forEach(treeComponent => {
      if (treeComponent.getLine().includes(StudioConstants.DropDownMenuSubstring)) treeComponent.unmountAndDestroy()
    })
  }

  async appendTileAndSelectCommand(line, children) {
    const tiles = this._appendTiles(line, children)
    tiles.forEach(tile => tile.execute())
    this.mountedProgram.clearSelection()
    await this.mountedProgram.getTab().autosaveAndRender()

    tiles.forEach(tile => tile.selectTile())
  }

  async insertChildPickerTileButton() {
    const program = this.getMountedTilesProgram()
    const tiles = program.getTiles()
    const target = tiles.length ? tiles[tiles.length - 1] : program
    const newTile = target.appendLineAndChildren(OhayoConstants.pickerTile)
    await this.getMountedTab().autosaveAndRender()
    newTile.selectTile()
  }

  insertAdjacentTileCommand() {
    return this.getAppWall().insertAdjacentTileCommand()
  }

  async appendTileCommand(line, children) {
    // Todo: we just removed race condition. But does UI suffer?
    await Promise.all(this._appendTiles(line, children).map(tile => tile.execute()))
    return this.mountedTab.autosaveAndRender()
  }

  async deleteAllRowsInTargetTileCommand() {
    const inputTable = this.getTargetNode().getParentOrDummyTable()
    await Promise.all(inputTable.getRows().map(row => row.destroyRow(this)))
    this.renderApp() // todo: cleanup
  }

  openOhayoProgramCommand(names) {
    return Promise.all(names.split(" ").map(name => this._openOhayoProgram(name)))
  }

  deleteFileCommand(filepath) {
    return this.unlinkFile(filepath)
  }

  async moveFileCommand(existingFullDiskFilePath, newFullDiskFilePath) {
    return this.moveFile(existingFullDiskFilePath, newFullDiskFilePath)
  }

  getAutocompleteResultsAtDocEndDiagnostic() {
    const lastLineIndex = this.mountedProgram.getNumberOfLines() - 1
    const lastLineNode = this.mountedProgram.nodeAtLine(lastLineIndex)
    const charIndex = lastLineNode.getIndentLevel() + lastLineNode.getLine().length - 1
    return this.mountedProgram
      .getAutocompleteResultsAt(lastLineIndex, charIndex)
      .matches.map(match => match.text)
      .join(" ")
  }

  async createNewBlankProgramCommand(filename = "untitled" + StudioConstants.ohayoExtension) {
    const tab = await this._createAndOpen("", filename)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async copyDeepLinkCommand() {
    this.getWillowBrowser().copyTextToClipboard(this.mountedTab.getDeepLink())
  }

  async createAndOpenNewProgramFromDeepLinkCommand(deepLink) {
    const uri = new URLSearchParams(new URL(deepLink).search)
    const fileName = decodeURIComponent(uri.get(StudioConstants.deepLinks.filename))
    let sourceCode = decodeURIComponent(uri.get(StudioConstants.deepLinks.data))
    if (uri.get(StudioConstants.deepLinks.edgeSymbol)) sourceCode = sourceCode.replace(new RegExp(uri.get(StudioConstants.deepLinks.edgeSymbol), "g"), " ")
    if (uri.get(StudioConstants.deepLinks.nodeBreakSymbol)) sourceCode = sourceCode.replace(new RegExp(uri.get(StudioConstants.deepLinks.nodeBreakSymbol), "g"), "\n")

    // todo: sec scan

    await this._createAndOpen(sourceCode, fileName)
    // Now remove the current page from history.
    // todo: cleanup by moving to willow
    if (typeof window !== "undefined") window.history.replaceState({}, document.title, location.pathname)
  }

  async openCreateNewProgramFromUrlDialogCommand() {
    const url = await this.willowBrowser.promptThen(`Enter the url to clone and edit`, "")

    if (!url) return undefined

    const res = await this.willowBrowser.httpGetUrl(url)

    const tab = await this._createAndOpen(res.text, "untitled" + StudioConstants.ohayoExtension)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async openFolderPromptCommand() {
    const folder = await this.willowBrowser.promptThen(`Enter a folder path to open multiple files`, this.getDefaultDisk().getPathBase())
    return folder ? this.openFolderCommand(folder) : undefined
  }

  async changeWorkingFolderPromptCommand() {
    const current = this.getDefaultDisk().getPathBase()
    const newWorkingFolder = await this.willowBrowser.promptThen(`Enter a folder path`, current)
    if (!newWorkingFolder || current === newWorkingFolder) return undefined
    return this.changeWorkingFolderCommand(newWorkingFolder)
  }

  async changeWorkingFolderCommand(newWorkingFolder) {
    newWorkingFolder = newWorkingFolder.replace(/\/$/, "") + "/"
    this.setWorkingFolder(newWorkingFolder)
  }

  async openFullDiskFilePathPromptCommand(suggestion) {
    const fullPath = await this.willowBrowser.promptThen(`Enter a full path to open`, suggestion || this.getDefaultDisk().getPathBase())

    if (!fullPath) return undefined
    new FullDiskPath(fullPath)
    // Todo: what if it does not exist.
    return this.openFullPathInNewTabAndFocus(fullPath)
  }

  async openFolderCommand(fullFolderPath) {
    fullFolderPath = new FullFolderPath(fullFolderPath, this)
    const files = await fullFolderPath.getFiles()

    return Promise.all(files.map(file => this._openFullDiskFilePathInNewTab(file.getFileLink())))
  }

  async confirmAndResetAppStateCommand() {
    const result = await this.willowBrowser.confirmThen(`Are you sure you want to reset the Ohayo Studio UI? Your files will not be lost.`)
    if (!result) return undefined
    this.resetAppState()
    this.willowBrowser.reload()
  }

  openUrlInNewTabCommand(url) {
    return this._openFullDiskFilePathInNewTab(new FullDiskPath(url).toString())
  }

  async mountTabByIndexCommand(index) {
    this.mountTabByIndex(index)
  }

  async closeTabByIndexCommand(index) {
    this.closeTab(this.getTabs()[index])
    this.renderApp()
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

  _getTabsNode() {
    return this.getNode("menu tabs")
  }

  closeTab(tab) {
    if (tab.isMounted()) {
      const tabToMountNext = jtree.Utils.getNextOrPrevious(this.getTabs())
      this.getPanel().removeWall()
      tab.unmountAndDestroy()
      delete this._focusedTab
      if (tabToMountNext) this.setMountedTab(tabToMountNext)
      else this.setMountedTabName()
    } else tab.destroy()
    this._updateLocationForRestoreOnRefresh()
  }

  async toggleAutoSaveCommand() {
    const newSetting = !this.isAutoSaveEnabled()
    if (!newSetting) this.storeValue(StorageKeys.autoSave, "false")
    else this.removeValue(StorageKeys.autoSave)
    this.addStumpCodeMessageToLog(`div Autosave is ${newSetting}`)
  }

  get willowBrowser() {
    return this.getWillowBrowser()
  }

  get mountedProgram() {
    return this.getMountedTilesProgram()
  }

  get mountedTab() {
    return this.getMountedTab()
  }

  async toggleThemeCommand() {
    this._toggleTheme()
  }

  openFullPathInNewTabAndFocusCommand(url) {
    return this.openFullPathInNewTabAndFocus(url)
  }

  async _showTabMoveFilePromptCommand(suggestedNewFilename, isRenameOp = false) {
    const mountedTab = this.mountedTab

    const newName = await this.promptToMoveFile(mountedTab.getFullTabFilePath(), suggestedNewFilename, isRenameOp)
    if (!newName) return false
    await this.closeTab(mountedTab)
    const tab = await this.openFullPathInNewTabAndFocus(newName)
    this.renderApp()
  }

  async showTabMoveFilePromptCommand(suggestedNewFilename) {
    await this._showTabMoveFilePromptCommand(suggestedNewFilename)
  }

  async showTabRenameFilePromptCommand(suggestedNewFilename) {
    await this._showTabMoveFilePromptCommand(suggestedNewFilename, true)
  }

  async toggleOfflineModeCommand() {
    this.willowBrowser.toggleOfflineMode()
  }

  async sleepCommand(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async toggleHelpCommand() {
    this.toggleAndRender(StudioConstants.helpModal)
  }

  async closeMountedProgramCommand() {
    this.closeTab(this.mountedTab)
    this.renderApp()
  }

  fetchAndReloadFocusedTabCommand() {
    return this.mountedTab.reloadFromDisk()
  }

  async selectAllTilesCommand() {
    // todo: bug. they are not showing selected state.
    this.mountedProgram.getTiles().forEach(tile => tile.selectTile())
  }

  async clearSelectionCommand() {
    this.addToCommandLog("app clearSelectionCommand") // todo: what is this?
    this.mountedProgram.clearSelection()
  }

  async deleteSelectionCommand() {
    this._deleteSelection()
    await this.mountedProgram.getTab().autosaveAndRender()
    // Todo: need to reposition all tiles if not using a custom layout
    // todo: makes me think we should put css top/left/width/height separately from css and stump (so mount 3 things)
  }

  _deleteSelection() {
    const tiles = this.mountedProgram.getSelectedNodes()
    if (!tiles.length) return undefined
    tiles.forEach(tile => {
      // New behavior is: shift children left 1. Dont delete them along with parent.
      tile
        .filter(tile => tile.doesExtend(OhayoConstants.abstractTileTreeComponentNode) && !tile.isSelected())
        .forEach(child => {
          child.unmount()
          child.shiftLeft()
        })
      tile.unmountAndDestroy()
    })
  }

  async duplicateSelectionCommand() {
    const newTiles = this.mountedProgram.getSelectedNodes().map(tile => tile.duplicate())
    await this.renderApp()
    this.mountedProgram.clearSelection()
    newTiles.forEach(tile => tile.selectTile())
    await this.mountedProgram.getTab().autosaveAndRender()
  }

  async showDeleteFileConfirmDialogCommand() {
    const filename = this.mountedTab.getFileName()
    // todo: make this an undo operation. on web should be easyish. on desktop via move to trash.
    const result = await this.willowBrowser.confirmThen(`Are you sure you want to delete ${filename}?`)
    return result ? this.deleteFocusedTabCommand() : undefined
  }

  async deleteFocusedTabCommand() {
    const tab = this.mountedTab
    await tab.unlinkTab()

    this.closeTab(tab)
    this.renderApp()
  }

  async mountPreviousTabCommand() {
    this.mountPreviousTab()
  }

  async mountNextTabCommand() {
    this.mountNextTab()
  }

  async closeAllTabsCommand() {
    this.closeAllTabs() // todo: confirm before closing if unsaved changes?
    this._getTabsNode()
      .getOpenTabs()
      .forEach(tab => {
        this.closeTab(tab)
      })
    this.renderApp()
  }

  async closeAllTabsExceptFocusedTabCommand() {
    this.closeAllTabsExceptFocusedTab() // todo: confirm before closing if unsaved changes?
    this.renderApp()
  }

  async toggleFullScreenCommand() {
    this.willowBrowser.toggleFullScreen()
  }

  _hideMenuAndTabs() {
    this.getNode(StudioConstants.menu).unmount()
    this.getNode(StudioConstants.menu).replaceNode(() => StudioConstants.menu + "PlaceHolder")
  }

  _showMenuAndTabs() {
    // todo: make this hide tabs
    this.getNode(StudioConstants.menu + "PlaceHolder").replaceNode(() => StudioConstants.menu)
  }

  toggleFocusedModeCommand() {
    this.has(StudioConstants.menu) ? this._hideMenuAndTabs() : this._showMenuAndTabs()
    this.makeAllDirty() // cleanup
    return this.toggleFullScreenCommand()
  }

  // TODO: make it slidable.?
  async toggleGutterWidthCommand() {
    this.getPanel().toggleGutterWidth()
    this.renderApp()
  }

  async toggleGutterCommand() {
    this.getPanel().toggleGutter()
    this.renderApp()
  }

  async selectNextTileCommand() {
    this._selectTileByDelta(1)
  }

  _selectTileByDelta(delta) {
    const program = this.mountedProgram
    const arr = program.getTiles()
    if (arr.length < 2) return true
    let currentIndex = arr.indexOf(program.getSelectedNodes()[0])
    const potentialNewIndex = currentIndex + delta
    program.clearSelection()
    arr[potentialNewIndex > arr.length - 1 ? 0 : potentialNewIndex === -1 ? arr.length - 1 : potentialNewIndex].selectTile()
  }

  async selectFirstTileCommand() {
    const firstTile = this.mountedProgram.getTiles()[0]
    firstTile && firstTile.selectTile()
  }

  async selectPreviousTileCommand() {
    this._selectTileByDelta(-1)
  }

  async createNewSourceCodeVisualizationProgramCommand() {
    // todo: make this create in memory? but then a refresh will end it.
    const sourceCode = this.mountedProgram.childrenToString()
    const template = OhayoCodeEditorTemplate(sourceCode, this.mountedTab.getFileName(), StudioConstants.ohayoExtension.substr(1))
    const tab = await this._createAndOpen(template, this.mountedTab.getFileName() + "-source-code-vis.ohayo")

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async createMiniMapCommand() {
    // todo: make this create in memory? but then a refresh will end it.
    const tab = await this._createAndOpen(MiniTemplate, "myPrograms" + StudioConstants.ohayoExtension)

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async clearTabMessagesCommand() {
    await this.mountedTab.clearMessageBufferCommand()

    this.renderApp()
  }

  async undoFocusedProgramCommand() {
    return this._undoOrRedo()
  }

  async redoFocusedProgramCommand() {
    return this._undoOrRedo(false)
  }

  async _undoOrRedo(undo = true) {
    this.mountedTab.getTabWall().unmount()
    undo ? this.mountedProgram.undo() : this.mountedProgram.redo()
    await this.mountedProgram.loadAndIncrementalRender()
  }

  async closeModalCommand() {
    this.closeModal()
  }

  async clearStoreCommand() {
    // todo: only clear this app values?
    return this.getStore().disabled ? undefined : this.getStore().clearAll()
  }

  async copySelectionCommand(evt) {
    if (!this.mountedProgram) return true

    const str = this._copySelection(evt)
    if (!str) return undefined
    this.mountedProgram.getRootNode().addStumpCodeMessageToLog(`div Items copied`)
    return str
  }

  async cutSelectionCommand(evt) {
    const str = this._copySelection(evt)
    if (!str) return undefined
    this._deleteSelection()
    this.mountedProgram.getRootNode().addStumpCodeMessageToLog(`div Items cut`)
    await this.mountedProgram.getTab().autosaveAndRender()
  }

  _copySelection(evt) {
    const willowBrowser = this.getWillowBrowser()
    if (this.terminalHasFocus() || willowBrowser.someInputHasFocus()) return ""
    // copy selected tiles
    const str = this.mountedProgram.selectionToString()
    if (!str) return ""
    willowBrowser.setCopyData(evt, str)
    return str
  }

  async echoCommand(...words) {
    this.addStumpCodeMessageToLog(`div ${words.join(" ")}`)
  }

  async saveTabAndNotifyCommand() {
    const tab = this.mountedTab
    await tab.forceSaveToFile()
    tab.addStumpCodeMessageToLog(`div Saved ${tab.getFileName()}
 title Saved ${tab.getFullTabFilePath()}`)
    this.renderApp()
  }

  cloneTabCommand() {
    return this._createAndOpen(this.mountedTab.getTabProgram().childrenToString(), this.mountedTab.getFileName())
  }

  async pasteCommand(pastedText) {
    if (this.mountedTab) await this.mountedTab.appendFromPaste(pastedText)
    else await this._createProgramFromPaste(pastedText)
  }

  async executeCommandOnStumpWithIdCommand(commandName, stumpNodeId) {
    await this._executeCommandByStumpNodeChild(commandName, "id " + stumpNodeId)
  }

  async executeCommandOnStumpWithClassCommand(commandName, stumpNodeClass) {
    await this._executeCommandByStumpNodeChild(commandName, "class " + stumpNodeClass)
  }

  async executeCommandByStumpNodeStringCommand(commandName, str) {
    await this._executeCommandByStumpNodeString(commandName, str)
  }

  async executeCommandOnFirstSelectedTileCommand(command, valueParam, nameParam) {
    const tile = this.mountedProgram.getSelectedNodes()[0]
    return tile[command](valueParam, nameParam)
  }

  async executeCommandOnLastSelectedTileCommand(command, valueParam, nameParam) {
    const tile = this.mountedProgram.getSelectedNodes()[this.mountedProgram.getSelectedNodes().length - 1]
    return tile[command](valueParam, nameParam)
  }

  async _doTileQualityCheckCommand() {
    // Note: currently required a mountedProgram
    const handGrammarProgram = this.mountedProgram.getHandGrammarProgram()
    const topNodeTypes = handGrammarProgram.getTopNodeTypeDefinitions().map(def => def.get("crux"))

    const sourceCode = topNodeTypes.join("\n")
    const tab = await this._createAndOpen(sourceCode, "all-tiles" + StudioConstants.ohayoExtension)
    const data = tab
      .getTabProgram()
      .getTiles()
      .filter(tile => tile.getTileQualityCheck) // only check Ohayo tiles
      .map(tile => tile.getTileQualityCheck())

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
    const sourceCode2 = new jtree.TreeNode(`data.inline
 tables.basic Quality Check Results`)
    sourceCode2.getNode("data.inline").appendLineAndChildren("content", new jtree.TreeNode(data).toCsv())
    const tab2 = await this._createAndOpen(sourceCode2.toString(), "tiles-quality-check-results" + StudioConstants.ohayoExtension)

    tab2.addStumpCodeMessageToLog(`div Created '${tab2.getFullTabFilePath()}'`)
  }

  async _runSpeedTestCommand() {
    const files = await this.getDefaultDisk().readFiles()
    const startTime = Date.now()

    const timePromises = files.map(async file => {
      const url = file.getFileLink()
      const newTab = await this._openFullDiskFilePathInNewTab(url)
      const mountedTab = this.getMountedTab()
      this.setMountedTab(newTab)
      if (mountedTab) this.closeTab(mountedTab)
      this.renderApp()
      return newTab.getTabProgram().toRunTimeStats()
    })

    const times = await Promise.all(timePromises)
    // todo: trigger shift+w shortcut instead of this if clause.
    if (this.getMountedTab()) this.closeMountedProgramCommand()
    const rowsAsCsv = new jtree.TreeNode(times)
    const runTime = Date.now() - startTime
    const title = `Program Load Times ${moment().format("MM/DD/YYYY")} version ${this.getVersion()}. Run time: ${runTime}`
    return this._createAndOpen(SpeedTestTemplate(title, rowsAsCsv.toCsv()), "program-load-times" + StudioConstants.ohayoExtension)
  }
}

module.exports = StudioApp
