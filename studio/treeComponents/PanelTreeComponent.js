const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const StudioConstants = require("./StudioConstants.js")
const { WallTreeComponent } = require("./WallTreeComponent.js")
const GutterTreeComponent = require("./GutterTreeComponent.js")

class PanelTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      gutter: GutterTreeComponent,
      wall: WallTreeComponent
    })
  }

  toggleGutter() {
    // todo: this is UI buggy! toggling resets scroll states
    const gutter = this.getGutter()
    if (gutter) gutter.unmountAndDestroy()
    else {
      const node = this.touchNode(StudioConstants.gutter)
      node.appendLine(StudioConstants.terminal)
      node.appendLine(StudioConstants.console)
    }
  }

  getGutter() {
    return this.getNode(StudioConstants.gutter)
  }

  toHakonCode() {
    const menuHeight = this.getParent().getMenuTreeComponent() ? "30" : "0"
    return `.PanelTreeComponent
 position relative
 left 0
 right 0
 bottom 0
 height calc(100% - ${menuHeight}px)`
  }

  getGutterWidth() {
    return parseInt(this.getWord(1))
  }

  setGutterWidth(newWidth) {
    this.setWord(1, newWidth)
    this.getWall().setGutterWidth(newWidth)
    this.getGutter().setGutterWidth(newWidth)
    return this
  }

  toggleGutterWidth() {
    const newWidth = this.getGutterWidth() === 50 ? 400 : 50
    this.setGutterWidth(newWidth)
    return this
  }

  getWall() {
    return this.getNode(StudioConstants.wall)
  }

  removeWall() {
    const wall = this.getWall()
    if (wall) wall.unmountAndDestroy()
  }

  // todo: remove?
  addWall() {
    this.removeWall()
    return this.appendLine(StudioConstants.wall)
  }
}

module.exports = PanelTreeComponent
