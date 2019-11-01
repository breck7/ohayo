const lodash = require("lodash")
const { jtree } = require("jtree")
const { AbstractTreeComponent, TreeComponentFrameworkDebuggerComponent, WillowConstants } = require("jtree/products/TreeComponentFramework.node.js")

const { FullFilePath, FullFolderPath, FullDiskPath, FileHandle } = require("../storage/FilePaths.js")
const LocalStorageDisk = require("../storage/LocalStorageDisk.js")
const ServerStorageDisk = require("../storage/ServerStorageDisk.js")
const StorageKeys = require("../storage/StorageKeys.js")

const Themes = require("../themes/Themes.js")
const ThemeConstants = require("../themes/ThemeConstants.js")
const Version = require("./Version.js")

/*NODE_JS_ONLY*/ const tilesNode = require("../tiles/tiles.nodejs.js")
/*NODE_JS_ONLY*/ const flowNode = require("../../flow/flow.nodejs.js")
/*NODE_JS_ONLY*/ const hakonNode = require("jtree/products/hakon.nodejs.js")
/*NODE_JS_ONLY*/ const fireNode = require("jtree/products/fire.nodejs.js")
/*NODE_JS_ONLY*/ const stumpNode = require("jtree/products/stump.nodejs.js")

const DemoTemplates = require("../templates/DemoTemplates.js")

const PanelTreeComponent = require("./PanelTreeComponent.js")
const MenuTreeComponent = require("./MenuTreeComponent.js")
const ThemeTreeComponent = require("./ThemeTreeComponent.js")
const AbstractModalTreeComponent = require("./AbstractModalTreeComponent.js")

const OhayoConstants = require("./OhayoConstants.js")
const HelpModal = require("./HelpModal.js")

const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")
const TabContextMenuTreeComponent = require("./TabContextMenuTreeComponent.js")
const TileContextMenuTreeComponent = require("./TileContextMenuTreeComponent.js")

const AppCommander = require("../commanders/AppCommander.js")

const TilesConstants = require("../tiles/TilesConstants.js")

const DataShadowEvents = {}

DataShadowEvents.onClickCommand = "stumpOnClickCommand"
DataShadowEvents.onBlurCommand = "stumpOnBlurCommand"
DataShadowEvents.onContextMenuCommand = "stumpOnContextMenuCommand"
DataShadowEvents.onChangeCommand = "stumpOnChangeCommand"
DataShadowEvents.onDblClickCommand = "stumpOnDblClickCommand"

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
    app.getCommander()[fn]()
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

// abstract
class OhayoWebApp extends AbstractTreeComponent {
  treeComponentWillMount() {
    this._startVisitCounter()
    this._commander = new AppCommander(this)

    const defaultState = this.getFromStore(StorageKeys.appState) || OhayoWebApp.getDefaultStartState()
    this.setChildren(defaultState)

    this._restoreTabs()

    this._makeProgramLinksOpenImmediately()
    this._makeDocumentCopyableAndCuttable()
    this._bindKeyboardShortcuts()

    const willowDoc = this.getWillowProgram()

    willowDoc.setResizeEndHandler(event => this._onResizeEndEvent(event))
    willowDoc.setPasteHandler(event => this._onPasteEvent(event))
    willowDoc.setLoadedDroppedFileHandler(files => {
      files.forEach(file => this.getCommander().createProgramFromFileCommand(file.filename, file.data))
    }, "Drop to create a new program.")

    this._setErrorHandlers()
    this.addStumpCodeMessageToLog(`div Ohayo!`)

    const deepLink = this._getDeepLink()
    if (deepLink) this.getCommander().createAndOpenNewProgramFromDeepLinkCommand(deepLink)
    else if (this._getVisitCount() === 1) this.getCommander().playFirstVisitCommand()
  }

  _getDeepLink() {
    if (this.isNodeJs()) return false
    return window.location.href.includes(OhayoConstants.deepLinks.filename) ? window.location.href : ""
  }

  async _onPasteEvent(event) {
    // Return true if worker is editing an input
    if (this.terminalHasFocus() || this.getWillowProgram().someInputHasFocus()) return true
    if (event.clipboardData && event.clipboardData.getData) await this.getCommander().pasteCommand(event.clipboardData.getData("text/plain"))
  }

  _onResizeEndEvent(event) {
    this.touchNode(OhayoConstants.windowSize).setContent(`${event.width} ${event.height}`)
    delete this._bodyShadowDimensionsCache
    this.renderApp()
  }

  _restoreTabs() {
    const panel = this.getFocusedPanel()
    const tabToMount = panel.getMountedTabName()
    panel.getTabs().forEach(async tab => {
      await tab._fetchTabInitProgramRenderAndRun(tab.getFullTabFilePath() === tabToMount)
      this.renderApp()
    })
  }

  _getProjectRootDir() {
    return this.isNodeJs() ? jtree.Utils.findProjectRoot(__dirname, "ohayo") : ""
  }

  getPerfSettings() {
    if (!this._perfSettings)
      this._perfSettings = {
        codeMirrorEnabled: true,
        bodyDragSelect: true,
        max10tiles: false
      }
    return this._perfSettings
  }

  terminalHasFocus() {
    const terminalNode = this.getFocusedPanel().getNode(`${OhayoConstants.gutter} ${OhayoConstants.terminal}`)
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

    const bodyStumpNode = this.getWillowProgram().getBodyStumpNode()
    const bodyShadow = bodyStumpNode.getShadow()

    return {
      width: bodyShadow.getShadowWidth(),
      height: bodyShadow.getShadowHeight()
    }
  }

  getCommander() {
    return this._commander
  }

  getWindowSizeMTime() {
    const node = this.getNode(OhayoConstants.windowSize)
    return node ? node.getLineModifiedTime() : 0
  }

  static getDefaultStartState() {
    return `${OhayoConstants.theme} ${ThemeConstants.workshop}
${OhayoConstants.menu}
${OhayoConstants.panel} 400
 ${OhayoConstants.tabs}
 ${OhayoConstants.gutter}
  ${OhayoConstants.terminal}
  ${OhayoConstants.console}`
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
    return this.getCommander()[args[0]].apply(this, args.slice(1))
  }

  getProgramConstructorFromFileExtension(treeLanguageName) {
    const grammars = this.getGrammars()
    return grammars[treeLanguageName] || grammars.flow
  }

  getFlowGrammarAsTree() {
    if (!this._flowGrammarTree) this._flowGrammarTree = new flowNode().getGrammarProgram()
    return this._flowGrammarTree
  }

  getGrammars() {
    if (!this._grammars) {
      this._grammars = {}
      this._grammars["flow"] = flowNode // todo: do the same as the others?
      this._grammars["tiles"] = tilesNode
      // todo: do the below on demand? is this slow?
      this._combineWithTilesAndRegisterGrammar("fire", new fireNode().getGrammarProgram().toTreeNode())
      this._combineWithTilesAndRegisterGrammar("hakon", new hakonNode().getGrammarProgram().toTreeNode())
      this._combineWithTilesAndRegisterGrammar("stump", new stumpNode().getGrammarProgram().toTreeNode())
    }
    return this._grammars
  }

  _combineWithTilesAndRegisterGrammar(extension, grammarCode) {
    const rootNode = grammarCode.getNode(extension + "Node")
    rootNode.set("extends", "tilesNode")
    grammarCode
      .filter(node => node.getLine().endsWith("Node") && !node.has("extends"))
      .forEach(node => {
        // todo: probably a better way
        if (node.toString().includes("boolean isTileAttribute true")) node.set("extends", "abstractTileSettingTerminalNode")
        else node.set("extends", "abstractTileTreeComponentNode")
      })
    const grammarProgram = new jtree.GrammarProgram(
      new tilesNode()
        .getGrammarProgram()
        .toString()
        .trim() +
        "\n" +
        grammarCode.toString()
    )
    if (this.isNodeJs()) grammarProgram._setDirName(__dirname) // todo: hacky, remove
    this._grammars[extension] = grammarProgram.getRootConstructor()
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
    map[OhayoConstants.tileContextMenu] = TileContextMenuTreeComponent
    map[OhayoConstants.tabContextMenu] = TabContextMenuTreeComponent
    map[OhayoConstants.panel] = PanelTreeComponent
    map[OhayoConstants.menu] = MenuTreeComponent
    map[OhayoConstants.theme] = ThemeTreeComponent
    map[OhayoConstants.helpModal] = HelpModal
    map["TreeComponentFrameworkDebuggerComponent"] = TreeComponentFrameworkDebuggerComponent

    return new jtree.TreeNode.Parser(jtree.TreeNode, map)
  }

  toHakonCode() {
    const theme = this.getTheme()
    return `.OhayoWebApp
 height 100%
 width 100%
.OhayoError
 color ${theme.errorColor}`
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
    this.getWillowProgram().setErrorHandler((message, file, line) => {
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
    const report = this.renderAndGetRenderReport(this.getWillowProgram().getBodyStumpNode())
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
    const panel = this.getFocusedPanel()
    const disk = this.getDefaultDisk()
    const fullPath = disk.getPathBase() + name
    const openTab = panel.getOpenTabByFullFilePath(fullPath)

    if (openTab) {
      panel.setMountedTab(openTab)
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

  getFocusedPanel() {
    return this.getNode(OhayoConstants.panel)
  }

  getMountedTab() {
    return this.getFocusedPanel().getMountedTab()
  }

  getMountedTilesProgram() {
    const mountedTab = this.getMountedTab()
    return mountedTab && mountedTab.getTabProgram()
  }

  getMenuTreeComponent() {
    return this.getNode(OhayoConstants.menu)
  }

  async _openFullDiskFilePathInNewTab(fullDiskFilePath) {
    const res = await this.getFocusedPanel().getAlreadyOpenTabOrOpenFullFilePathInNewTab(new FullDiskPath(fullDiskFilePath).toString())
    return res
  }

  async openFullPathInNewTabAndFocus(fullDiskFilePath) {
    const tab = await this.getFocusedPanel().getAlreadyOpenTabOrOpenFullFilePathInNewTab(new FullDiskPath(fullDiskFilePath).toString(), true)
    return tab
  }

  isAutoSaveEnabled() {
    return this.getFromStore(StorageKeys.autoSave) !== "false"
  }

  getLanguageBestGuess(sourceCode) {
    const grammars = this.getGrammars()

    const getErrorCount = (extension, rootConstructor) => {
      const program = new rootConstructor(sourceCode)
      return {
        name: extension,
        errorCount: program.getAllErrors().length
      }
    }

    const guesses = lodash.sortBy(Object.keys(grammars).map(extension => getErrorCount(extension, grammars[extension])), ["errorCount"])
    const bestGuess = guesses[0].name
    return bestGuess
  }

  generateProgram(sourceCode, treeLanguage) {
    const programConstructor = this.getProgramConstructorFromFileExtension(treeLanguage)
    return new programConstructor(sourceCode)
  }

  getThemeName() {
    return this.get(OhayoConstants.theme)
  }

  getTheme() {
    return Themes[this.getThemeName()] || Themes.glass
  }

  _toggleTheme() {
    const newThemeName = jtree.Utils.toggle(this.getThemeName(), Object.keys(Themes))
    this.addStumpCodeMessageToLog(`div Switched to ${newThemeName} theme`)
    this.set(OhayoConstants.theme, newThemeName)
    this.saveAppState()
    this.makeAllDirty() // todo:remove
    this.renderApp()
  }

  async promptToMoveFile(existingFullDiskFilePath, suggestedNewFilename, isRenameOp = false) {
    const path = new FullDiskPath(existingFullDiskFilePath)
    const suggestedFullDiskFilePath = suggestedNewFilename ? path.getWithoutFilename() + suggestedNewFilename : existingFullDiskFilePath

    let newFullDiskFilePath

    if (isRenameOp) {
      const newNameOnly = await this.getWillowProgram().promptThen("Enter new name for file", suggestedNewFilename || path.getFilename())
      newFullDiskFilePath = newNameOnly ? path.getWithoutFilename() + newNameOnly : newNameOnly
    } else newFullDiskFilePath = await this.getWillowProgram().promptThen("Enter new name for file", suggestedFullDiskFilePath || existingFullDiskFilePath)

    if (!newFullDiskFilePath || newFullDiskFilePath === existingFullDiskFilePath) return undefined

    newFullDiskFilePath = new FullDiskPath(newFullDiskFilePath)

    newFullDiskFilePath = newFullDiskFilePath.getWithoutFilename() + jtree.Utils.stringToPermalink(newFullDiskFilePath.getFilename())
    if (!newFullDiskFilePath) return undefined
    const resultingName = await this.getCommander().moveFileCommand(existingFullDiskFilePath, newFullDiskFilePath)

    this.addStumpCodeMessageToLog(`div Moved`)
    return resultingName
  }

  getKeyboardShortcuts() {
    if (!this._shortcuts)
      this._shortcuts = new DrumsProgram(
        typeof OhayoDrums === "undefined"
          ? jtree.TreeNode.fromDisk(this._getProjectRootDir() + "ohayoWebApp/treeComponents/Ohayo.drums")
          : new jtree.TreeNode(OhayoDrums)
      )
    return this._shortcuts
  }

  _getMousetrap() {
    return this.getWillowProgram().getMousetrap()
  }

  _bindKeyboardShortcuts() {
    const mouseTrap = this._getMousetrap()
    const willowBrowser = this.getWillowProgram()

    mouseTrap._originalStopCallback = mouseTrap.prototype.stopCallback
    mouseTrap.prototype.stopCallback = function(evt, element, shortcut) {
      const stumpNode = willowBrowser.getStumpNodeFromElement(element)
      if (stumpNode && shortcut === "command+s" && stumpNode.stumpNodeHasClass("savable")) {
        stumpNode.getShadow().triggerShadowEvent(WillowConstants.ShadowEvents.change)
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
    return this.getWillowProgram().getStore()
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
    app
      .getWillowProgram()
      .setCopyHandler(evt => app.getCommander().copySelectionCommand(evt))
      .setCutHandler(evt => app.getCommander().cutSelectionCommand(evt))
  }

  _handleLinkClick(stumpNode, evt) {
    if (!stumpNode) return undefined
    const link = stumpNode.getStumpNodeAttr("href")
    if (!link || stumpNode.getStumpNodeAttr("target")) return undefined
    evt.preventDefault()
    if (this.getWillowProgram().isExternalLink(link)) {
      this.openExternalLink(link)
      return false
    }
  }

  openExternalLink(link) {
    this.getWillowProgram().openUrl(link)
  }

  getAppWall() {
    return this.getFocusedPanel()
      .getNode(OhayoConstants.tabs)
      .getWall()
  }

  // for tests
  getRenderedTilesDiagnostic() {
    return this.getMountedTilesProgram()
      .getTiles()
      .filter(tile => tile.isMounted())
  }

  // for tests
  getMountedTilesDiagnostic() {
    return jtree.Utils.flatten(
      this.getFocusedPanel()
        .getNode(OhayoConstants.tabs)
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
    await this._createAndOpen(pastedText, `untitled${OhayoConstants.fileExtensions.flow}`) // todo: guess language!
  }

  // for tests and debugging
  // todo: only relevant for FlowTiles with tables
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
    const addServerDisk = this.isNodeJs() ? false : this.getWillowProgram().isDesktopVersion() && typeof isOhayoDesktop !== "undefined"
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
    const willowBrowser = this.getWillowProgram()
    willowBrowser
      .getBodyStumpNode()
      .getShadow()
      .onShadowEvent(WillowConstants.ShadowEvents.click, "a", function(evt) {
        app._handleLinkClick(willowBrowser.getStumpNodeFromElement(this), evt)
      })
  }

  _onCommandWillRun() {
    this.closeAllContextMenus() // todo: move these to a body handler?
    this.getCommander().closeAllDropDownMenusCommand()
  }

  async _executeStumpNodeCommandByStumpNodeChild(commandName, stumpNodeChild) {
    const willowBrowser = this.getWillowProgram()
    const stumpNode = willowBrowser.getBodyStumpNode().findStumpNodeByChild(stumpNodeChild)
    await this._executeStumpNodeCommand(stumpNode, stumpNode.getStumpNodeAttr(commandName))
  }

  async _executeStumpNodeCommandByStumpNodeString(commandName, str) {
    const willowBrowser = this.getWillowProgram()
    const stumpNode = willowBrowser.getBodyStumpNode().findStumpNodeByChildString(str)
    await this._executeStumpNodeCommand(stumpNode, stumpNode.getStumpNodeAttr(commandName))
  }
}

module.exports = OhayoWebApp
