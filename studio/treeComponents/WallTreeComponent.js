const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const OhayoConstants = require("../treeComponents/OhayoConstants.js")

class WallTreeComponent extends AbstractTreeComponent {
  // pin?
  // duplicate?
  // reload?
  toHakonCode() {
    const theme = this.getTheme()
    const gutterWidth = this._gutterWidth
    return `.WallTreeComponent
 background-color ${theme.wallBackground}
 background-image ${theme.wallBackgroundImage || "none"}
 width calc(100% - ${gutterWidth}px)
 left ${gutterWidth}px
 display block
 position relative
 height 100%
 overflow scroll
.insertChildTileButton
 text-align center
 font-size 28px
 font-weight bold
 opacity .9
 width 50px
 margin auto
 &:hover
  opacity 1
  cursor pointer

.${OhayoConstants.selectedClass}
 outline 3px solid ${theme.selectedOutline}`
  }

  get _gutterWidth() {
    const value = this.getWord(1)
    return value === undefined ? this.getParent().getGutterWidth() : value
  }

  setGutterWidth(newWidth) {
    this.setWord(1, newWidth)
    return this
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
 div +
  class insertChildTileButton
  clickCommand insertChildPickerTileCommand`
  }

  _getSelectedTileStumpNodes() {
    return this.getRootNode()
      .getWillowBrowser()
      .getBodyStumpNode()
      .findStumpNodesWithClass(OhayoConstants.selectedClass) // todo: also filter by .abstractTileTreeComponentNode?
  }
}

module.exports = { WallTreeComponent }
