const { AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

class TileToolbarCommander extends AbstractCommander {
  get _targetTileCommander() {
    return this.getTarget()
      .getTargetTile()
      .getCommander()
  }

  createProgramFromFocusedTileExampleCommand(uno, dos) {
    return this._targetTileCommander.createProgramFromTileExampleCommand(uno, dos)
  }

  cloneFocusedTileCommand(uno, dos) {
    return this._targetTileCommander.cloneTileCommand(uno, dos)
  }
  destroyFocusedTileCommand(uno, dos) {
    return this._targetTileCommander.destroyTileCommand(uno, dos)
  }
  inspectFocusedTileCommand(uno, dos) {
    return this._targetTileCommander.inspectTileCommand(uno, dos)
  }
  changeFocusedTileTypeCommand(uno, dos) {
    return this._targetTileCommander.changeTileTypeCommand(uno, dos)
  }
  changeFocusedTileParentCommand(uno, dos) {
    return this._targetTileCommander.changeParentCommand(uno, dos)
  }
  changeFocusedTileContentAndRenderCommand(uno, dos) {
    return this._targetTileCommander.changeTileContentAndRenderCommand(uno, dos)
  }
}
module.exports = TileToolbarCommander
