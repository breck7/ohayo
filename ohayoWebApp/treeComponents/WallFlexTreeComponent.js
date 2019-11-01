const { WillowConstants } = require("jtree/products/TreeComponentFramework.node.js")

const TilesConstants = require("../tiles/TilesConstants.js")
const WallFlexCommander = require("../commanders/WallFlexCommander.js")

const WallTreeComponent = require("./WallTreeComponent.js")

class WallFlexTreeComponent extends WallTreeComponent {
  _resizeTiles(stumpNode) {
    const selected = this._getSelectedTileStumpNodes()
    selected.length > 1 ? selected.forEach(stumpNode => this._resizeStumpNode(stumpNode)) : this._resizeStumpNode(stumpNode)
    this.getCommander().setLayoutToCustomCommand()
  }

  getCommander() {
    return new WallFlexCommander(this)
  }

  _resizeStumpNode(stumpNode) {
    const tile = stumpNode.getStumpNodeTreeComponent()
    const shadow = stumpNode.getShadow()
    const gridSize = this.getGridSize()
    const commander = tile.getCommander()
    const position = shadow.getPositionAndDimensions(gridSize)
    commander.changeTileSettingCommand(TilesConstants.width, position.width)
    commander.changeTileSettingCommand(TilesConstants.height, position.height)
  }

  getPickerBlock(event) {
    const offset = 0 // todo: take into account navigator.
    const gridSize = 20
    const left = Math.floor((event.offsetX - offset) / gridSize)
    const _top = Math.floor(event.offsetY / gridSize)
    return `${TilesConstants.left} ${left}
${TilesConstants.top} ${_top}`
  }

  _moveStumpNode(stumpNode) {
    const tile = stumpNode.getStumpNodeTreeComponent()
    const shadow = stumpNode.getShadow()
    const gridSize = this.getGridSize()
    const position = shadow.getPositionAndDimensions(gridSize)
    tile.getCommander().changeTileSettingCommand(TilesConstants.left, position.left)
    tile.getCommander().changeTileSettingCommand(TilesConstants.top, position.top)
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
    const willowBrowser = app.getWillowProgram()
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
      .onShadowEvent(WillowConstants.ShadowEvents.mouseover, "." + TilesConstants.abstractTileTreeComponentNode, function() {
        const tileStumpNode = app.getWillowProgram().getStumpNodeFromElement(this)
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
        app.getCommander().moveTilesFromShadowsCommand()
      },
      grid: [gridSize, gridSize],
      handle: ".TileGrabber",
      drag: function(event, ui) {
        if (!shadow.shadowHasClass(TilesConstants.selectedClass)) return
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
