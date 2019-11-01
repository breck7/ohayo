const { jtree } = require("jtree")

const WallCommander = require("../commanders/WallCommander.js")
const TilesConstants = require("../tiles/TilesConstants.js")

class WallFlexCommander extends WallCommander {
  setLayoutToCustomCommand() {
    const wall = this.getTarget()
    const app = wall.getRootNode()
    const tab = app.getMountedTab()
    const tabProgram = tab.getTabProgram()
    tabProgram.touchNode(TilesConstants.layout).setContent(TilesConstants.custom)
    return tab.autosaveAndRender()
  }

  moveTilesFromShadowsCommand() {
    // todo: remove this. ditch jqery ui.
    const wall = this.getTarget()
    const app = wall.getRootNode()
    app
      .getWillowProgram()
      .getBodyStumpNode()
      .findStumpNodesWithClass(TilesConstants.abstractTileTreeComponentNode)
      .filter(stumpNode => stumpNode.getStumpNodeTreeComponent().isVisible())
      .forEach(stumpNode => wall._moveStumpNode(stumpNode))
    return this.setLayoutToCustomCommand()
  }

  _getLayoutOptions(mountedProgram) {
    // only include custom IF there are custom properties.
    const toggleOptions = Object.keys(TilesConstants.layouts).filter(key => key !== TilesConstants.layouts.custom)
    if (mountedProgram.canUseCustomLayout()) toggleOptions.push(TilesConstants.layouts.custom)
    return toggleOptions
  }

  async toggleLayoutCommand() {
    const mountedProgram = this.getTarget()
      .getRootNode()
      .getMountedTilesProgram()
    const currentLayoutNode = mountedProgram.touchNode(TilesConstants.layout)
    const currentLayout = currentLayoutNode.getContent() || TilesConstants.layouts.tiled
    const newLayout = jtree.Utils.toggle(currentLayout, this._getLayoutOptions(mountedProgram))
    currentLayoutNode.setContent(newLayout)
    mountedProgram.getTiles().forEach(tile => tile.makeDirty()) // todo: delete this
    const tab = mountedProgram.getTab()
    tab.addStumpCodeMessageToLog(`div Layout changed to '${newLayout}'.`)
    await tab.autosaveAndRender()
  }
}

module.exports = WallFlexCommander
