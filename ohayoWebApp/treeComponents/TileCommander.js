const { jtree } = require("jtree")

const TilesConstants = require("../tiles/TilesConstants.js")
const OhayoConstants = require("../treeComponents/OhayoConstants.js")

const { AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

class TileCommander extends AbstractCommander {
  cloneTileCommand() {
    const tile = this.getTarget()
    tile.cloneAndOffset()
    return tile.getTab().autosaveAndRender()
  }

  async updateContentFromHtmlCommand(val) {
    const clean = jtree.Utils.stripHtml(val.replace(/\<br\>/g, "\n").replace(/\<div\>/g, "\n"))
    return this.changeTileContentAndRenderCommand(clean)
  }

  async toggleTileMaximizeCommand() {
    const tile = this.getTarget()
    if (tile.has(TilesConstants.maximized)) tile.delete(TilesConstants.maximized)
    else tile.touchNode(TilesConstants.maximized)
    await this._runAfterTileUpdate(tile)
  }

  async triggerTileMethodCommand(value, methodName) {
    const tile = this.getTarget()
    await tile[methodName](value)
    await this._runAfterTileUpdate(tile)
  }

  // todo: refactor.
  async changeTileTypeCommand(newValue) {
    const tile = this.getTarget()
    tile.setFirstWord(newValue)
    const newNode = tile.duplicate()
    // todo: destroy or something? how do we reparse.
    tile.unmountAndDestroy()
    const app = tile.getTab().getRootNode()
    await tile.getRootNode().loadRequirements()

    await tile.getTab().autosaveAndRender()

    newNode.runAndrenderAndGetRenderReport()
  }

  changeParentCommand(pathVector) {
    const tile = this.getTarget()
    // if (tile.getFirstWordPath() === value) return; // todo: do we need this line?
    const program = tile.getRootNode()
    const indexPath = pathVector ? pathVector.split(" ").map(num => parseInt(num)) : ""
    const destinationTree = indexPath ? program.nodeAt(indexPath) : program
    // todo: on jtree should we make copyTo second param optional?
    tile.copyTo(destinationTree, destinationTree.length)
    tile.unmountAndDestroy()
    return tile.getTab().autosaveAndRender()
  }

  async openTileContextMenuCommand() {
    const tile = this.getTarget()
    tile
      .getTab()
      .getRootNode()
      .setTargetNode(tile)
      .toggleAndRender(OhayoConstants.tileContextMenu)
  }

  destroyTileCommand() {
    const tile = this.getTarget()
    tile.unmountAndDestroy()
    return tile.getTab().autosaveAndRender()
  }

  getNewDataCommand() {
    // todo: have some type of paging system to fetch new data.
  }

  async changeTileSettingAndRenderCommand(value, settingName) {
    const tile = this.getTarget()
    // note the unusual ordering of params.
    tile.touchNode(settingName).setContent(value.toString())
    // todo: sometimes size needs to be redone (maximize, for example)
    await this._runAfterTileUpdate(tile)
  }

  // todo: remove
  async changeTileSettingMultilineCommand(val, settingName) {
    const tile = this.getTarget()
    tile.touchNode(settingName).setChildren(val)
    await this._runAfterTileUpdate(tile)
  }

  async changeTileSettingCommand(settingName, value) {
    const tile = this.getTarget()
    tile.touchNode(settingName).setContent(value)
  }

  async changeWordAndRenderCommand(value, index) {
    const tile = this.getTarget()
    tile.setWord(parseInt(index), value)
    await this._runAfterTileUpdate(tile)
  }

  async changeWordsAndRenderCommand(value, index) {
    index = parseInt(index)
    const tile = this.getTarget()
    const edgeSymbol = tile.getEdgeSymbol()
    const words = tile.getWords().slice(0, index)
    tile.setLine(words.concat(value.split(edgeSymbol)).join(edgeSymbol))
    await this._runAfterTileUpdate(tile)
  }

  async updateChildrenCommand(val) {
    const tile = this.getTarget()
    tile.setChildren(val)

    // reload the whole doc for now.

    await this._runAfterTileUpdate(tile)
  }

  async _runAfterTileUpdate(tile) {
    tile.makeDirty() // ugly!
    tile.getChildTiles().forEach(tile => {
      tile.makeDirty() // todo: ugly!
    })
    // todo: what if you have a tile that has a contextare that allows editing of its children/
    // if you edit a child, then that parent tile needs to update to...should we allow that or ban that?
    await tile.getTab().autosaveTab()
    await tile.runAndrenderAndGetRenderReport()
    tile
      .getTab()
      .getRootNode()
      .renderApp() // Need to render full app because of code editor
  }

  // todo: downstream data changes?
  async changeTileContentAndRenderCommand(value) {
    const tile = this.getTarget()
    tile.setContent(value)
    await this._runAfterTileUpdate(tile)
  }

  async copyTileCommand() {
    const tile = this.getTarget()
    // todo: remove cousin tiles?
    tile
      .getRootNode()
      .getWillowProgram()
      .copyTextToClipboard(tile.getFirstAncestor().toString())
  }

  async createProgramFromTileExampleCommand(index) {
    const tile = this.getTarget()
    const template = tile.getExampleTemplate(index)
    if (!template) return undefined
    const fileExtension = "maia" // todo: generalize
    const tab = await tile
      .getTab()
      .getRootNode()
      ._createAndOpen(template, `help-for-${tile.getFirstWord()}.${fileExtension}`)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async inspectTileCommand() {
    const tile = this.getTarget()
    if (!tile.isNodeJs()) {
      console.log("Tile available at window.tile")
      window.tile = tile
      console.log(tile)
    }
    const output = tile.toInspection()
    tile.getTab().addStumpCodeMessageToLog(output)
    tile
      .getTab()
      .getRootNode()
      .renderApp()
  }

  async toggleToolbarCommand() {
    const tile = this.getTarget()
    tile.toggleToolbar()
  }

  async createProgramFromTemplateCommand(id) {
    const tile = this.getTarget()
    const programTemplate = tile.getProgramTemplate(id)
    if (!programTemplate) return undefined
    const tab = await tile
      .getTab()
      .getRootNode()
      ._createAndOpen(programTemplate.template, programTemplate.name)
    tab.addStumpCodeMessageToLog(`div Created '${tab.getFullTabFilePath()}'`)
  }

  async appendSnippetTemplateCommand(id) {
    const tile = this.getTarget()
    const snippet = tile.getSnippetTemplate(id)
    if (!snippet) return undefined

    const tab = tile.getTab()
    const tabProgram = tab.getTabProgram()
    const newNodes = tabProgram.concat(snippet)
    const newTiles = newNodes.filter(tile => tile.doesExtend && tile.doesExtend("abstractTileTreeComponentNode"))
    tab.autosaveTab()
    tabProgram.clearSelection()
    tab.getTabWall().unmount()

    await tabProgram.loadAndIncrementalRender()
    newTiles.forEach(tile => tile.selectTile())
    newTiles[0].scrollIntoView()
  }

  async copyDataCommand(delimiter) {
    const tile = this.getTarget()
    tile
      .getRootNode()
      .getWillowProgram()
      .copyTextToClipboard(tile.getOutputOrInputTable().toDelimited(delimiter))
  }

  async copyDataAsJavascriptCommand() {
    const tile = this.getTarget()
    const table = tile.getOutputOrInputTable()
    tile
      .getRootNode()
      .getWillowProgram()
      .copyTextToClipboard(JSON.stringify(table.toTree().toDataTable(table.getColumnNames()), null, 2))
  }

  async copyDataAsTreeCommand() {
    const tile = this.getTarget()
    const text = tile
      .getOutputOrInputTable()
      .toTree()
      .toString()
    tile
      .getRootNode()
      .getWillowProgram()
      .copyTextToClipboard(text)
  }

  async exportTileDataCommand(format = "csv") {
    const tile = this.getTarget()

    // todo: figure this out. use the browsers filename? tile title? id?

    let extension = "csv"
    let type = "text/csv"
    let str = tile.getOutputOrInputTable().toDelimited(",")

    if (format === "tree") {
      extension = "tree"
      type = "text"
      str = tile
        .getOutputOrInputTable()
        .toTree()
        .toString()
    }

    tile
      .getRootNode()
      .getWillowProgram()
      .downloadFile(str, tile.getTab().getFileName() + "." + extension, type)
  }
}

module.exports = TileCommander
