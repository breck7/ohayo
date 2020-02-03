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

  getGutter() {
    return this.getNode(StudioConstants.gutter)
  }

  get _menuHeight() {
    return this.getWord(2)
  }

  setMenuHeight(value) {
    this.setWord(2, value)
  }

  toHakonCode() {
    return `.PanelTreeComponent
 position relative
 left 0
 right 0
 bottom 0
 height calc(100% - ${this._menuHeight}px)`
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

  toggleGutter() {
    const newWidth = this.getGutterWidth() === 0 ? 400 : 0
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
