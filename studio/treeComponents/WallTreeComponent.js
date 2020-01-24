const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const OhayoConstants = require("../tiles/OhayoConstants.js")

class WallTreeComponent extends AbstractTreeComponent {
  // pin?
  // duplicate?
  // reload?
  toHakonCode() {
    const theme = this.getTheme()
    return `.WallTreeComponent
 background-color ${theme.wallBackground}
 background-image ${theme.wallBackgroundImage || "none"}
 display block
 position relative
 height 100%
 overflow scroll

.ui-selectable-helper
 position absolute
 z-index 100
 border-radius 2px
 background ${theme.selectionBackground}

.ui-selecting,.${OhayoConstants.selectedClass},.${OhayoConstants.staySelectedClass}
 outline 3px solid ${theme.selectedOutline}`
  }

  getPickerBlock(event) {}

  async openWallContextMenuCommand() {
    this.getRootNode().toggleAndRender("tabContextMenu")
  }

  async insertAdjacentTileCommand() {
    const app = this.getRootNode()
    const tilesProgram = app.getMountedTilesProgram()
    // todo: it seems like we don't want to have that insert multiple behavior. removed it for now.
    const newTiles = app
      .getNodeCursors()
      .slice(0, 1)
      .map(cursor => cursor.appendLine(OhayoConstants.pickerTile))
    const promise = await app.getMountedTab().autosaveAndRender()
    tilesProgram.clearSelection()
    newTiles.forEach(tile => tile.selectTile())
    return promise
  }

  async insertPickerTileCommand() {
    const app = this.getRootNode()
    const evt = app.getMouseEvent()
    const tilesProgram = app.getMountedTilesProgram()

    if (!evt.shiftKey) {
      tilesProgram.clearSelection()
    }
    // todo: it seems like we don't want to have that insert multiple behavior. removed it for now.
    const newTiles = app
      .getNodeCursors()
      .slice(0, 1)
      .map(cursor => cursor.appendLineAndChildren(OhayoConstants.pickerTile, this.getPickerBlock(evt)))
    await app.getMountedTab().autosaveAndRender()
    tilesProgram.clearSelection()
    newTiles.forEach(tile => {
      tile.selectTile()
    })
  }

  getDependencies() {
    return [{ getLineModifiedTime: () => this.getRootNode().getWindowSizeMTime() }]
  }

  selectTilesByShadowClass(className = OhayoConstants.selectedClass) {
    this.getRootNode()
      .getWillowBrowser()
      .findStumpNodesByShadowClass(className)
      .forEach(stumpNode => stumpNode.getStumpNodeTreeComponent().selectTile())
  }

  getWallViewPortDimensions() {
    // depends on window.resize and whether gutter is open
    const bodyShadowDimensions = this.getRootNode().getBodyShadowDimensions()

    return {
      width: bodyShadowDimensions.width - this.getParent().getGutterWidth(),
      height: bodyShadowDimensions.height
    }
  }

  treeComponentDidUpdate() {
    // todo: I don't think this ever gets called. actually seems to get called when you toggle gutter
    this._makeSelectable()
  }

  _getChildTreeComponents() {
    const tilesProgram = this.getRootNode().getMountedTilesProgram()
    return tilesProgram ? tilesProgram.getTiles() : []
  }

  treeComponentDidMount() {
    this.treeComponentDidUpdate()
  }

  toStumpCode() {
    return `div
 class WallTreeComponent
 contextMenuCommand openWallContextMenuCommand
 doubleClickCommand insertPickerTileCommand`
  }

  _getSelectedTileStumpNodes() {
    return this.getRootNode()
      .getWillowBrowser()
      .getBodyStumpNode()
      .findStumpNodesWithClass(OhayoConstants.selectedClass) // todo: also filter by .abstractTileTreeComponentNode?
  }

  _makeSelectable() {
    const app = this.getRootNode()
    const stumpNode = this.getStumpNode()
    const willowBrowser = app.getWillowBrowser()
    const selector = "." + OhayoConstants.abstractTileTreeComponentNode
    const shadow = stumpNode.getShadow()

    // I think we need this because jquery selectable breaks click behavior otherwise?
    shadow.onShadowEvent("click", function(evt) {
      // Only if this is the direct target
      if (evt.target === shadow.getShadowElement()) willowBrowser.blurFocusedInput()
    })

    // todo: can we delay this a bit? getting a perf hit.
    // can we move off jquery ui?
    // todo: https://bugs.jqueryui.com/ticket/15044
    //todo: SPEED!!!

    if (app.getPerfSettings().bodyDragSelect) {
      let wasAdded = false

      // NOTE: SHADOW AND STUMP GET OUT OF SYNC HERE....NEED TESTS. NEED TO MVOE SHADOW AND STUMP
      // TO THEIR OWN TESTED REPO.
      shadow.onShadowEvent("mouseover", function(evt) {
        if (wasAdded) return true
        wasAdded = true
        shadow.makeSelectable({
          cancel: selector,
          distance: 10,
          filter: selector,
          start: function(evt) {
            if (evt.shiftKey)
              willowBrowser
                .getBodyStumpNode()
                .findStumpNodesWithClass(OhayoConstants.selectedClass)
                .forEach(stumpNode => {
                  stumpNode.addClassToStumpNode(OhayoConstants.staySelectedClass)
                })
            else app.clearSelectionCommand()
          },
          stop: function() {
            willowBrowser
              .getBodyStumpNode()
              .findStumpNodesWithClass(OhayoConstants.staySelectedClass)
              .forEach(stumpNode => {
                stumpNode.removeClassFromStumpNode(OhayoConstants.staySelectedClass)
                stumpNode.addClassToStumpNode(OhayoConstants.selectedClass)
              })
            app.selectTilesByShadowClassCommand()
            return true
          }
        })
      })
    }
  }
}

module.exports = { WallTreeComponent }
