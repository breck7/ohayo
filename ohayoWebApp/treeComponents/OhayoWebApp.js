const lodash = require("lodash")
const { jtree } = require("jtree")
const moment = require("moment")
const { AbstractTreeComponent, TreeComponentFrameworkDebuggerComponent, WillowConstants, AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

const { FullFilePath, FullFolderPath, FullDiskPath, FileHandle } = require("../storage/FilePaths.js")
const LocalStorageDisk = require("../storage/LocalStorageDisk.js")
const ServerStorageDisk = require("../storage/ServerStorageDisk.js")
const StorageKeys = require("../storage/StorageKeys.js")

const Themes = require("../themes/Themes.js")
const ThemeConstants = require("../themes/ThemeConstants.js")
const Version = require("./Version.js")

/*NODE_JS_ONLY*/ const tilesNode = require("../tiles/tiles.nodejs.js")
/*NODE_JS_ONLY*/ const maiaNode = require("../../maia/maia.nodejs.js")
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

const TilesConstants = require("../tiles/TilesConstants.js")

const DataShadowEvents = {}

DataShadowEvents.onClickCommand = "stumpOnClickCommand"
DataShadowEvents.onBlurCommand = "stumpOnBlurCommand"
DataShadowEvents.onContextMenuCommand = "stumpOnContextMenuCommand"
DataShadowEvents.onChangeCommand = "stumpOnChangeCommand"
DataShadowEvents.onDblClickCommand = "stumpOnDblClickCommand"

const MaiaCodeEditorTemplate = require("../templates/MaiaCodeEditorTemplate.js")
const MiniTemplate = require("../templates/MiniTemplate.js")
const SpeedTestTemplate = require("../templates/SpeedTestTemplate.js")
const MaiaTemplates = require("../templates/MaiaTemplates.js")

class AppCommander extends AbstractCommander {
  async playFirstVisitCommand() {
    // await this.openOhayoProgramCommand("faq.maia")
    // todo: make this create in memory?
    await this.openOhayoProgramCommand(OhayoConstants.productName + OhayoConstants.fileExtensions.maia)
  }

  get _targetCommander() {
    return this.app.getTargetNode().getCommander()
  }

  copyTargetTileCommand(uno, dos) {
    return this._targetCommander.copyTileCommand(uno, dos)
  }

  copyTargetTileDataAsTreeCommand(uno, dos) {
    return this._targetCommander.copyDataAsTreeCommand(uno, dos)
  }

  copyTargetTileDataAsJavascriptCommand(uno, dos) {
    return this._targetCommander.copyDataAsJavascriptCommand(uno, dos)
  }

  copyTargetTileDataCommand(uno, dos) {
    return this._targetCommander.copyDataCommand(uno, dos)
  }

  exportTargetTileDataCommand(uno, dos) {
    return this._targetCommander.exportTileDataCommand(uno, dos)
  }

  moveTilesFromShadowsCommand() {
    return this.app
      .getAppWall()
      .getCommander()
      .moveTilesFromShadowsCommand()
  }

  async toggleLayoutCommand() {
    const wallCommander = this.app.getAppWall().getCommander()
    return wallCommander.toggleLayoutCommand && wallCommander.toggleLayoutCommand() // todo: cleanup
  }

  async togglePerfModeCommand() {
    const settings = this.app.getPerfSettings()
    Object.keys(settings).forEach(key => {
      settings[key] = !settings[key]
    })

    // todo: what is this?.. ah, codeMirror vs terminal should be different.
    this.app.getFocusedPanel().toggleGutter()
    this.app.getFocusedPanel().toggleGutter()
    this.renderApp()
  }

  async cellCheckProgramCommand() {
    const program = this.mountedTab.getTabProgram()
    const errors = program.getAllErrors().map(err => err.getMessage())
    this.mountedTab.addStumpCodeMessageToLog(
      `strong ${errors.length} errors in ${this.mountedTab.getFileName()}
div - ${errors.join("\ndiv - ")}`
    )
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
    if (this.app.getGrammars()[extension]) return this.app._createAndOpen(data, filename)

    const templateFn = MaiaTemplates[extension]
    const program = templateFn ? templateFn(filename, data, this.app) : `html.h1 No visualization templates for ${filename}`
    return this.app._createAndOpen(program, filename + OhayoConstants.fileExtensions.maia)
  }

  async toggleShadowByIdCommand(id) {
    this.willowProgram
      .getBodyStumpNode()
      .findStumpNodeByChild("id " + id)
      .getShadow()
      .toggleShadow()
  }

  async fillShadowInputOrTextAreaByClassNameCommand(className, value) {
    this.willowProgram
      .getBodyStumpNode()
      .findStumpNodesWithClass(className)
      .forEach(stumpNode => {
        stumpNode.getShadow().setInputOrTextAreaValue(value)
      })
  }

  async openDeleteAllTabsPromptCommand() {
    const tabs = this.focusedPanel.getTabs()

    const shouldProceed = await this.willowProgram.confirmThen(`Are you sure you want to delete ${tabs.length} open files?`)

    return shouldProceed ? Promise.all(tabs.map(tab => tab.unlinkTab())) : false
  }

  async toggleAndRenderNewDropDownCommand() {
    this.app.getNode(OhayoConstants.menu).toggleAndRender(OhayoConstants.newDropDownMenu)
  }

  renderApp() {
    this.app.renderApp()
  }

  async closeAllDropDownMenusCommand() {
    this.app.getTopDownArray().forEach(treeComponent => {
      if (treeComponent.getLine().includes(OhayoConstants.DropDownMenuSubstring)) treeComponent.unmountAndDestroy()
    })
  }

  async appendTileAndSelectCommand(line, children) {
    const app = this.app
    const tiles = app._appendTiles(line, children)
    tiles.forEach(tile => tile.execute())
    this.mountedProgram.clearSelection()
    await this.mountedProgram.getTab().autosaveAndRender()

    tiles.forEach(tile => tile.selectTile())
  }

  insertPickerTileCommand() {
    return this.app
      .getAppWall()
      .getCommander()
      .insertPickerTileCommand()
  }

  insertAdjacentTileCommand() {
    return this.app
      .getAppWall()
      .getCommander()
      .insertAdjacentTileCommand()
  }

  async appendTileCommand(line, children) {
    // Todo: we just removed race condition. But does UI suffer?
    await Promise.all(this.app._appendTiles(line, children).map(tile => tile.execute()))
    return this.mountedTab.autosaveAndRender()
  }

  async deleteAllRowsInTargetTileCommand() {
    const inputTable = this.app.getTargetNode().getParentOrDummyTable()
    const app = this.app
    await Promise.all(inputTable.getRows().map(row => row.destroyRow(app)))
    this.renderApp() // todo: cleanup
  }

  openOhayoProgramCommand(names) {
    return Promise.all(names.split(" ").map(name => this.app._openOhayoProgram(name)))
  }

  deleteFileCommand(filepath) {
    return this.app.unlinkFile(filepath)
  }

  async moveFileCommand(existingFullDiskFilePath, newFullDiskFilePath) {
    return this.app.moveFile(existingFullDiskFilePath, newFullDiskFilePath)
  }

  async createNewBlankProgramCommand(filename = "untitled" + OhayoConstants.fileExtensions.maia) {
    const tab = await this.app._createAndOpen("", filename)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async copyDeepLinkCommand() {
    this.app.getWillowProgram().copyTextToClipboard(this.mountedTab.getDeepLink())
  }

  async createAndOpenNewProgramFromDeepLinkCommand(deepLink) {
    const uri = new URLSearchParams(new URL(deepLink).search)
    const fileName = decodeURIComponent(uri.get(OhayoConstants.deepLinks.filename))
    let sourceCode = decodeURIComponent(uri.get(OhayoConstants.deepLinks.data))
    if (uri.get(OhayoConstants.deepLinks.edgeSymbol)) sourceCode = sourceCode.replace(new RegExp(uri.get(OhayoConstants.deepLinks.edgeSymbol), "g"), " ")
    if (uri.get(OhayoConstants.deepLinks.nodeBreakSymbol)) sourceCode = sourceCode.replace(new RegExp(uri.get(OhayoConstants.deepLinks.nodeBreakSymbol), "g"), "\n")

    // todo: sec scan

    await this.app._createAndOpen(sourceCode, fileName)
    // Now remove the current page from history.
    // todo: cleanup by moving to willow
    if (typeof window !== "undefined") window.history.replaceState({}, document.title, location.pathname)
  }

  async openCreateNewProgramFromUrlDialogCommand() {
    const url = await this.willowProgram.promptThen(`Enter the url to clone and edit`, "")

    if (!url) return undefined

    const res = await this.willowProgram.httpGetUrl(url)

    const tab = await this.app._createAndOpen(res.text, "untitled" + OhayoConstants.fileExtensions.maia)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async openFolderPromptCommand() {
    const folder = await this.willowProgram.promptThen(`Enter a folder path to open multiple files`, this.app.getDefaultDisk().getPathBase())
    return folder ? this.openFolderCommand(folder) : undefined
  }

  async changeWorkingFolderPromptCommand() {
    const current = this.app.getDefaultDisk().getPathBase()
    const newWorkingFolder = await this.willowProgram.promptThen(`Enter a folder path`, current)
    if (!newWorkingFolder || current === newWorkingFolder) return undefined
    return this.changeWorkingFolderCommand(newWorkingFolder)
  }

  async changeWorkingFolderCommand(newWorkingFolder) {
    newWorkingFolder = newWorkingFolder.replace(/\/$/, "") + "/"
    this.app.setWorkingFolder(newWorkingFolder)
  }

  async openFullDiskFilePathPromptCommand(suggestion) {
    const fullPath = await this.willowProgram.promptThen(`Enter a full path to open`, suggestion || this.app.getDefaultDisk().getPathBase())

    if (!fullPath) return undefined
    new FullDiskPath(fullPath)
    // Todo: what if it does not exist.
    return this.app.openFullPathInNewTabAndFocus(fullPath)
  }

  async openFolderCommand(fullFolderPath) {
    const app = this.app
    fullFolderPath = new FullFolderPath(fullFolderPath, app)
    const files = await fullFolderPath.getFiles()

    return Promise.all(files.map(file => app._openFullDiskFilePathInNewTab(file.getFileLink())))
  }

  async confirmAndResetAppStateCommand() {
    const app = this.app
    const result = await this.willowProgram.confirmThen(`Are you sure you want to reset the Ohayo UI? Your files will not be lost.`)
    if (!result) return undefined
    this.app.resetAppState()
    this.willowProgram.reload()
  }

  openUrlInNewTabCommand(url) {
    return this.app._openFullDiskFilePathInNewTab(new FullDiskPath(url).toString())
  }

  async mountTabByIndexCommand(index) {
    this.focusedPanel.mountTabByIndex(index)
  }

  async closeTabByIndexCommand(index) {
    this.focusedPanel.closeTabByIndex(index)
    this.renderApp()
  }

  async toggleAutoSaveCommand() {
    const app = this.app
    const newSetting = !app.isAutoSaveEnabled()
    if (!newSetting) app.storeValue(StorageKeys.autoSave, "false")
    else app.removeValue(StorageKeys.autoSave)
    app.addStumpCodeMessageToLog(`div Autosave is ${newSetting}`)
  }

  async saveCompiledCommand() {
    const grammarProgram = this.mountedProgram.getGrammarProgram()
    const outputExtension = grammarProgram.getTargetExtension()
    const filename = jtree.Utils.stringToPermalink(jtree.Utils.removeFileExtension(this.mountedTab.getFileName())) + "." + outputExtension
    this.willowProgram.downloadFile(this.mountedProgram.compile(), filename, "text/" + outputExtension)
  }

  async executeProgramCommand() {
    // todo: sec considerations? prevent someone from triggering this command w/o user input.
    let result = await this.mountedTab.getTabProgram().execute()
    if (typeof result !== "string") result = result.join("\n")
    this.mountedTab.logMessageText(encodeURIComponent(result))
    this.renderApp()
  }

  get focusedPanel() {
    return this.app.getFocusedPanel()
  }

  get willowProgram() {
    return this.app.getWillowProgram()
  }

  get app() {
    return this.getTarget()
  }

  get mountedProgram() {
    return this.app.getMountedTilesProgram()
  }

  get mountedTab() {
    return this.app.getMountedTab()
  }

  async toggleThemeCommand() {
    this.app._toggleTheme()
  }

  openFullPathInNewTabAndFocusCommand(url) {
    return this.app.openFullPathInNewTabAndFocus(url)
  }

  async _showTabMoveFilePromptCommand(suggestedNewFilename, isRenameOp = false) {
    const mountedTab = this.mountedTab

    const newName = await this.app.promptToMoveFile(mountedTab.getFullTabFilePath(), suggestedNewFilename, isRenameOp)
    if (!newName) return false
    const tab = await this.app.openFullPathInNewTabAndFocus(newName)
    this.focusedPanel.closeTab(mountedTab)
    this.renderApp()
    return tab
  }

  async showTabMoveFilePromptCommand(suggestedNewFilename) {
    return this._showTabMoveFilePromptCommand(suggestedNewFilename)
  }

  async showTabRenameFilePromptCommand(suggestedNewFilename) {
    return this._showTabMoveFilePromptCommand(suggestedNewFilename, true)
  }

  async toggleOfflineModeCommand() {
    this.willowProgram.toggleOfflineMode()
  }

  async sleepCommand(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async toggleHelpCommand() {
    this.app.toggleAndRender(OhayoConstants.helpModal)
  }

  async closeMountedProgramCommand() {
    this.focusedPanel.closeTab(this.mountedTab)
    this.renderApp()
  }

  fetchAndReloadFocusedTabCommand() {
    return this.mountedTab.reloadFromDisk()
  }

  async selectAllTilesCommand() {
    // todo: bug. they are not showing selected state.
    this.mountedProgram.getTiles().forEach(tile => tile.selectTile())
  }

  async selectTilesByShadowClassCommand(className) {
    this.app.addToCommandLog("app selectTilesByShadowClassCommand")
    this.mountedTab.getTabWall().selectTilesByShadowClass(className)
  }

  async clearSelectionCommand() {
    this.app.addToCommandLog("app clearSelectionCommand")
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
        .filter(tile => tile.doesExtend("abstractTileTreeComponentNode") && !tile.isSelected())
        .forEach(child => {
          child.unmount()
          child.shiftLeft()
        })
      tile.unmountAndDestroy()
    })
  }

  async duplicateSelectionCommand() {
    const newTiles = this.mountedProgram.getSelectedNodes().map(tile => tile.cloneAndOffset())
    await this.app.renderApp()
    this.mountedProgram.clearSelection()
    newTiles.forEach(tile => tile.selectTile())
    await this.mountedProgram.getTab().autosaveAndRender()
  }

  async showDeleteFileConfirmDialogCommand() {
    const filename = this.mountedTab.getFileName()
    // todo: make this an undo operation. on web should be easyish. on desktop via move to trash.
    const result = await this.willowProgram.confirmThen(`Are you sure you want to delete ${filename}?`)
    return result ? this.deleteFocusedTabCommand() : undefined
  }

  async deleteFocusedTabCommand() {
    const tab = this.mountedTab
    await tab.unlinkTab()

    this.focusedPanel.closeTab(tab)
    this.renderApp()
  }

  async mountPreviousTabCommand() {
    this.focusedPanel.mountPreviousTab()
  }

  async mountNextTabCommand() {
    this.focusedPanel.mountNextTab()
  }

  async closeAllTabsCommand() {
    this.focusedPanel.closeAllTabs() // todo: confirm before closing if unsaved changes?
    this.renderApp()
  }

  async closeAllTabsExceptFocusedTabCommand() {
    this.focusedPanel.closeAllTabsExceptFocusedTab() // todo: confirm before closing if unsaved changes?
    this.renderApp()
  }

  async toggleFullScreenCommand() {
    this.willowProgram.toggleFullScreen()
  }

  toggleFocusedModeCommand() {
    this.app.toggle(OhayoConstants.menu)
    return this.toggleFullScreenCommand()
  }

  // TODO: make it slidable.?
  async toggleGutterWidthCommand() {
    this.focusedPanel.toggleGutterWidth()
    this.renderApp()
  }

  async toggleGutterCommand() {
    this.app.getFocusedPanel().toggleGutter()
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
    const template = MaiaCodeEditorTemplate(sourceCode, this.mountedTab.getFileName(), OhayoConstants.fileExtensions.maia.substr(1))
    const tab = await this.app._createAndOpen(template, this.mountedTab.getFileName() + "-source-code-vis.maia")

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async createMiniMapCommand() {
    // todo: make this create in memory? but then a refresh will end it.
    const tab = await this.app._createAndOpen(MiniTemplate, "myPrograms" + OhayoConstants.fileExtensions.maia)

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async clearTabMessagesCommand() {
    await this.mountedTab.getCommander().clearMessageBufferCommand()

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
    this.app.closeModal()
  }

  async clearStoreCommand() {
    // todo: only clear this app values?
    return this.app.getStore().disabled ? undefined : this.app.getStore().clearAll()
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
    const app = this.app
    const willowBrowser = app.getWillowProgram()
    if (app.terminalHasFocus() || willowBrowser.someInputHasFocus()) return ""
    // copy selected tiles
    const str = this.mountedProgram.selectionToString()
    if (!str) return ""
    willowBrowser.setCopyData(evt, str)
    return str
  }

  async echoCommand(...words) {
    this.app.addStumpCodeMessageToLog(`div ${words.join(" ")}`)
  }

  async saveTabAndNotifyCommand() {
    const tab = this.mountedTab
    await tab.forceSaveToFile()
    tab.addStumpCodeMessageToLog(`div Saved ${tab.getFileName()}
 title Saved ${tab.getFullTabFilePath()}`)
    this.renderApp()
  }

  cloneTabCommand() {
    return this.app._createAndOpen(this.mountedTab.getTabProgram().childrenToString(), this.mountedTab.getFileName())
  }

  async pasteCommand(pastedText) {
    if (this.mountedTab) await this.mountedTab.appendFromPaste(pastedText)
    else await this.app._createProgramFromPaste(pastedText)
  }

  async executeStumpNodeCommandByStumpNodeIdCommand(commandName, stumpNodeId) {
    await this.app._executeStumpNodeCommandByStumpNodeChild(commandName, "id " + stumpNodeId)
  }

  async executeStumpNodeCommandByStumpNodeClassCommand(commandName, stumpNodeClass) {
    await this.app._executeStumpNodeCommandByStumpNodeChild(commandName, "class " + stumpNodeClass)
  }

  async executeStumpNodeCommandByStumpNodeStringCommand(commandName, str) {
    await this.app._executeStumpNodeCommandByStumpNodeString(commandName, str)
  }

  async executeCommandOnFirstSelectedTileCommand(command, valueParam, nameParam) {
    const commander = this.mountedProgram.getSelectedNodes()[0].getCommander()
    return commander[command](valueParam, nameParam)
  }

  async executeCommandOnLastSelectedTileCommand(command, valueParam, nameParam) {
    const tile = this.mountedProgram.getSelectedNodes()[this.mountedProgram.getSelectedNodes().length - 1]
    const commander = tile.getCommander()
    return commander[command](valueParam, nameParam)
  }

  async _doTileQualityCheckCommand() {
    // Note: currently required a mountedProgram
    const grammarProgram = this.mountedProgram.getGrammarProgram()
    const topNodeTypes = grammarProgram.getTopNodeTypeDefinitions().map(def => def.get("crux"))

    const sourceCode = topNodeTypes.join("\n") + `\n${TilesConstants.layout} ${TilesConstants.layouts.column}`
    const tab = await this.app._createAndOpen(sourceCode, "all-tiles" + OhayoConstants.fileExtensions.maia)
    const data = tab
      .getTabProgram()
      .getTiles()
      .filter(tile => tile.getTileQualityCheck) // only check Maia tiles
      .map(tile => tile.getTileQualityCheck())

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
    const sourceCode2 = new jtree.TreeNode(`data.inline
 tables.basic Quality Check Results`)
    sourceCode2.getNode("data.inline").appendLineAndChildren("content", new jtree.TreeNode(data).toCsv())
    const tab2 = await this.app._createAndOpen(sourceCode2.toString(), "tiles-quality-check-results" + OhayoConstants.fileExtensions.maia)

    tab2.addStumpCodeMessageToLog(`div Created '${tab2.getFullTabFilePath()}'`)
  }

  async _runSpeedTestCommand() {
    const app = this.app
    const files = await app.getDefaultDisk().readFiles()
    const startTime = Date.now()
    const focusedPanel = this.focusedPanel

    const timePromises = files.map(async file => {
      const url = file.getFileLink()
      const newTab = await app._openFullDiskFilePathInNewTab(url)
      const mountedTab = focusedPanel.getMountedTab()
      focusedPanel.setMountedTab(newTab)
      if (mountedTab) focusedPanel.closeTab(mountedTab)
      app.renderApp()
      return newTab.getTabProgram().toRunTimeStats()
    })

    const times = await Promise.all(timePromises)
    // todo: trigger shift+w shortcut instead of this if clause.
    if (focusedPanel.getMountedTab()) this.closeMountedProgramCommand()
    const rowsAsCsv = new jtree.TreeNode(times)
    const runTime = Date.now() - startTime
    const title = `Program Load Times ${moment().format("MM/DD/YYYY")} version ${app.getVersion()}. Run time: ${runTime}`
    return app._createAndOpen(SpeedTestTemplate(title, rowsAsCsv.toCsv()), "program-load-times" + OhayoConstants.fileExtensions.maia)
  }
}

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
    return grammars[treeLanguageName] || grammars.maia
  }

  getMaiaGrammarAsTree() {
    if (!this._maiaGrammarTree) this._maiaGrammarTree = new maiaNode().getGrammarProgram()
    return this._maiaGrammarTree
  }

  getGrammars() {
    if (!this._grammars) {
      this._grammars = {}
      this._grammars["maia"] = maiaNode // todo: do the same as the others?
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

  isConnectedToOhayoServerApp() {
    return typeof isConnectedToOhayoServerApp !== "undefined"
  }

  isUrlGetProxyAvailable() {
    return this.isConnectedToOhayoServerApp()
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
        typeof OhayoDrums === "undefined" ? jtree.TreeNode.fromDisk(this._getProjectRootDir() + "ohayoWebApp/treeComponents/Ohayo.drums") : new jtree.TreeNode(OhayoDrums)
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
    await this._createAndOpen(pastedText, `untitled${OhayoConstants.fileExtensions.maia}`) // todo: guess language!
  }

  // for tests and debugging
  // todo: only relevant for MaiaTiles with tables
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
    const addServerDisk = this.isNodeJs() ? false : this.isConnectedToOhayoServerApp()
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
