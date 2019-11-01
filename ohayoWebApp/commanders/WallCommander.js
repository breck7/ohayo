const { AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")
const TilesConstants = require("../tiles/TilesConstants.js")

class WallCommander extends AbstractCommander {
  async openWallContextMenuCommand() {
    this.getTarget()
      .getRootNode()
      .toggleAndRender("tabContextMenu")
  }

  async insertAdjacentTileCommand() {
    const wall = this.getTarget()
    const app = wall.getRootNode()
    const tilesProgram = app.getMountedTilesProgram()
    // todo: it seems like we don't want to have that insert multiple behavior. removed it for now.
    const newTiles = app
      .getNodeCursors()
      .slice(0, 1)
      .map(cursor => cursor.appendLine(TilesConstants.pickerTile))
    const promise = await app.getMountedTab().autosaveAndRender()
    tilesProgram.clearSelection()
    newTiles.forEach(tile => tile.selectTile())
    return promise
  }

  async insertPickerTileCommand() {
    const wall = this.getTarget()
    const app = wall.getRootNode()
    const evt = app.getMouseEvent()
    const tilesProgram = app.getMountedTilesProgram()

    if (!evt.shiftKey) {
      tilesProgram.clearSelection()
    }
    // todo: it seems like we don't want to have that insert multiple behavior. removed it for now.
    const newTiles = app
      .getNodeCursors()
      .slice(0, 1)
      .map(cursor => cursor.appendLineAndChildren(TilesConstants.pickerTile, wall.getPickerBlock(evt)))
    await app.getMountedTab().autosaveAndRender()
    tilesProgram.clearSelection()
    newTiles.forEach(tile => {
      tile.selectTile()
    })
  }
}

module.exports = WallCommander
