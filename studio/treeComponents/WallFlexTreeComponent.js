const { jtree } = require("jtree")

const OhayoConstants = require("../tiles/OhayoConstants.js")

const { WallTreeComponent } = require("./WallTreeComponent.js")

class WallFlexTreeComponent extends WallTreeComponent {
  _resizeTiles(stumpNode) {
    const selected = this._getSelectedTileStumpNodes()
    selected.length > 1 ? selected.forEach(stumpNode => this._resizeStumpNode(stumpNode)) : this._resizeStumpNode(stumpNode)
    this.setLayoutToCustomCommand()
  }

  setLayoutToCustomCommand() {
    const app = this.getRootNode()
    const tab = app.getMountedTab()
    const tabProgram = tab.getTabProgram()
    tabProgram.touchNode(OhayoConstants.layout).setContent(OhayoConstants.custom)
    return tab.autosaveAndRender()
  }

  moveTilesFromShadowsCommand() {
    // todo: remove this. ditch jqery ui.
    const app = this.getRootNode()
    app
      .getWillowBrowser()
      .getBodyStumpNode()
      .findStumpNodesWithClass(OhayoConstants.abstractTileTreeComponentNode)
      .filter(stumpNode => stumpNode.getStumpNodeTreeComponent().isVisible())
      .forEach(stumpNode => this._moveStumpNode(stumpNode))
    return this.setLayoutToCustomCommand()
  }

  _getLayoutOptions(mountedProgram) {
    // only include custom IF there are custom properties.
    const toggleOptions = Object.keys(OhayoConstants.layouts).filter(key => key !== OhayoConstants.layouts.custom)
    if (mountedProgram.canUseCustomLayout()) toggleOptions.push(OhayoConstants.layouts.custom)
    return toggleOptions
  }

  async toggleLayoutCommand() {
    const mountedProgram = this.getRootNode().getMountedTilesProgram()
    const currentLayoutNode = mountedProgram.touchNode(OhayoConstants.layout)
    const currentLayout = currentLayoutNode.getContent() || OhayoConstants.layouts.tiled
    const newLayout = jtree.Utils.toggle(currentLayout, this._getLayoutOptions(mountedProgram))
    currentLayoutNode.setContent(newLayout)
    mountedProgram.getTiles().forEach(tile => tile.makeDirty()) // todo: delete this
    const tab = mountedProgram.getTab()
    tab.addStumpCodeMessageToLog(`div Layout changed to '${newLayout}'.`)
    await tab.autosaveAndRender()
  }

  _resizeStumpNode(stumpNode) {
    const tile = stumpNode.getStumpNodeTreeComponent()
    const shadow = stumpNode.getShadow()
    const gridSize = this.getGridSize()
    const position = shadow.getPositionAndDimensions(gridSize)
    tile.changeTileSettingCommand(OhayoConstants.width, position.width)
    tile.changeTileSettingCommand(OhayoConstants.height, position.height)
  }

  getPickerBlock(event) {
    const offset = 0 // todo: take into account navigator.
    const gridSize = 20
    const left = Math.floor((event.offsetX - offset) / gridSize)
    const _top = Math.floor(event.offsetY / gridSize)
    return `${OhayoConstants.left} ${left}
${OhayoConstants.top} ${_top}`
  }

  _moveStumpNode(stumpNode) {
    const tile = stumpNode.getStumpNodeTreeComponent()
    const shadow = stumpNode.getShadow()
    const gridSize = this.getGridSize()
    const position = shadow.getPositionAndDimensions(gridSize)
    tile.changeTileSettingCommand(OhayoConstants.left, position.left)
    tile.changeTileSettingCommand(OhayoConstants.top, position.top)
  }

  getGridSize() {
    return 20
  }

  treeComponentDidMount() {
    this._makeTilesMoveableAndResizableAndEditable()
    super.treeComponentDidMount()
  }

  _tileMouseOverHandler(tileStumpNode) {
    const shadow = tileStumpNode.getShadow()
    if (!shadow.isShadowResizable()) this._makeShadowResizable(shadow)
    if (!shadow.isShadowDraggable()) this._makeGroupDraggable(tileStumpNode)
  }

  _makeShadowResizable(shadow) {
    const gridSize = this.getGridSize()
    const app = this.getRootNode()
    const that = this
    const willowBrowser = app.getWillowBrowser()
    shadow.makeResizable({
      handles: "se",
      grid: gridSize,
      resize: evt => {
        //  otherwise will trigger a window resize
        evt.stopPropagation()
        evt.preventDefault()
        return false
      },
      stop: ui => that._resizeTiles(willowBrowser.getStumpNodeFromElement(ui.target))
    })
  }

  _makeTilesMoveableAndResizableAndEditable() {
    const app = this.getRootNode()
    const that = this
    this.getStumpNode()
      .getShadow()
      .onShadowEvent("mouseover", "." + OhayoConstants.abstractTileTreeComponentNode, function() {
        const tileStumpNode = app.getWillowBrowser().getStumpNodeFromElement(this)
        that._tileMouseOverHandler(tileStumpNode)
      })
  }

  _updateSelectedOnMove(draggedStumpNode, change) {
    this._getSelectedTileStumpNodes()
      .filter(stumpNode => stumpNode !== draggedStumpNode)
      .forEach(stumpNode => {
        const position = {
          top: parseFloat(stumpNode.getStumpNodeCss("top")),
          left: parseFloat(stumpNode.getStumpNodeCss("left"))
        }
        const newCss = {
          transform: "",
          top: position.top + change.top + "px",
          left: position.left + change.left + "px"
        }
        stumpNode.setStumpNodeCss(newCss)
      })
  }

  _getElementChangeInPixels(ui, offset) {
    return {
      left: ui.offset.left - offset.left,
      top: ui.offset.top - offset.top
    }
  }

  _makeGroupDraggable(stumpNode) {
    const shadow = stumpNode.getShadow()
    let offset
    let originalLeft
    let originalTop
    let newLeft
    let newTop
    const that = this
    const app = this.getRootNode()
    const gridSize = this.getGridSize()

    const options = {
      stop: function(event, ui) {
        shadow.removeClassFromShadow("noTransition")
        shadow.setShadowAttr("data-translate", newLeft + " " + newTop)
        const change = that._getElementChangeInPixels(ui, offset)
        that._updateSelectedOnMove(stumpNode, change)
        offset = ui // todo: what does this do?
        app.moveTilesFromShadowsCommand()
      },
      grid: [gridSize, gridSize],
      handle: ".TileGrabber",
      drag: function(event, ui) {
        if (!shadow.shadowHasClass(OhayoConstants.selectedClass)) return
        // move entire selection
        const change = that._getElementChangeInPixels(ui, offset)
        that
          ._getSelectedTileStumpNodes()
          .filter(selectedStumpNode => selectedStumpNode !== stumpNode)
          .forEach(selectedStumpNode => selectedStumpNode.setStumpNodeCss({ transform: `translate(${change.left}px, ${change.top}px)` }))
      },
      start: function(event, ui) {
        offset = ui.offset
        shadow.addClassToShadow("noTransition")
        const translate = shadow.getShadowAttr("data-translate")
        if (translate) {
          originalLeft = parseInt(translate.split(" ")[0])
          originalTop = parseInt(translate.split(" ")[1])
        } else {
          originalLeft = 0
          originalTop = 0
        }
      }
    }

    shadow.addClassToShadow("draggable").makeDraggable(options)
  }
}

module.exports = WallFlexTreeComponent
