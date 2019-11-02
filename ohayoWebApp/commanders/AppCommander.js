const { jtree } = require("jtree")
const moment = require("moment")
const { AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

const { FullFilePath, FullFolderPath, FullDiskPath, FileHandle } = require("../storage/FilePaths.js")
const StorageKeys = require("../storage/StorageKeys.js")

const TilesConstants = require("../tiles/TilesConstants.js")
const OhayoConstants = require("../treeComponents/OhayoConstants.js")

const FlowCodeEditorTemplate = require("../templates/FlowCodeEditorTemplate.js")
const MiniTemplate = require("../templates/MiniTemplate.js")
const SpeedTestTemplate = require("../templates/SpeedTestTemplate.js")
const FlowTemplates = require("../templates/FlowTemplates.js")

class AppCommander extends AbstractCommander {
  async playFirstVisitCommand() {
    // await this.openOhayoProgramCommand("faq.flow")
    // todo: make this create in memory?
    await this.openOhayoProgramCommand(OhayoConstants.productName + OhayoConstants.fileExtensions.flow)
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

    const templateFn = FlowTemplates[extension]
    const program = templateFn ? templateFn(filename, data, this.app) : `html.h1 No visualization templates for ${filename}`
    return this.app._createAndOpen(program, filename + OhayoConstants.fileExtensions.flow)
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

  async createNewBlankProgramCommand(filename = "untitled" + OhayoConstants.fileExtensions.flow) {
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
    if (uri.get(OhayoConstants.deepLinks.nodeBreakSymbol))
      sourceCode = sourceCode.replace(new RegExp(uri.get(OhayoConstants.deepLinks.nodeBreakSymbol), "g"), "\n")

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

    const tab = await this.app._createAndOpen(res.text, "untitled" + OhayoConstants.fileExtensions.flow)
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
    const template = FlowCodeEditorTemplate(sourceCode, this.mountedTab.getFileName(), OhayoConstants.fileExtensions.flow.substr(1))
    const tab = await this.app._createAndOpen(template, this.mountedTab.getFileName() + "-source-code-vis.flow")

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async createMiniMapCommand() {
    // todo: make this create in memory? but then a refresh will end it.
    const tab = await this.app._createAndOpen(MiniTemplate, "myPrograms" + OhayoConstants.fileExtensions.flow)

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
    const tab = await this.app._createAndOpen(sourceCode, "all-tiles" + OhayoConstants.fileExtensions.flow)
    const data = tab
      .getTabProgram()
      .getTiles()
      .filter(tile => tile.getTileQualityCheck) // only check Flow tiles
      .map(tile => tile.getTileQualityCheck())

    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
    const sourceCode2 = new jtree.TreeNode(`data.inline
 tables.basic Quality Check Results`)
    sourceCode2.getNode("data.inline").appendLineAndChildren("content", new jtree.TreeNode(data).toCsv())
    const tab2 = await this.app._createAndOpen(sourceCode2.toString(), "tiles-quality-check-results" + OhayoConstants.fileExtensions.flow)

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
    return app._createAndOpen(SpeedTestTemplate(title, rowsAsCsv.toCsv()), "program-load-times" + OhayoConstants.fileExtensions.flow)
  }
}

module.exports = AppCommander
