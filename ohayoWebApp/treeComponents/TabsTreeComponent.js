const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const { FullDiskPath } = require("../storage/FilePaths.js")

const TabTreeComponent = require("./TabTreeComponent.js")
const WallTreeComponent = require("./WallTreeComponent.js")
const WallFlexTreeComponent = require("./WallFlexTreeComponent.js")
const OhayoConstants = require("./OhayoConstants.js")

class TabsTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      tab: TabTreeComponent,
      wall: WallTreeComponent,
      flex: WallFlexTreeComponent
    })
  }

  removeWall() {
    const wall = this.getWall()
    if (wall) wall.unmountAndDestroy()
  }

  getDependencies() {
    // todo: cleanup
    return [this.getParent()]
  }

  getOpenTabs() {
    return this.getChildrenByNodeConstructor(TabTreeComponent)
  }

  getWall() {
    return this.getNode(OhayoConstants.wall) || this.getNode(OhayoConstants.flex)
  }

  addWall(type = OhayoConstants.wall) {
    this.removeWall()
    return this.appendLine(type)
  }

  addTab(url) {
    const line = `tab ${new FullDiskPath(url).toString()}`
    // todo: add before wall
    return this.getWall() ? this.insertLine(line, -1) : this.appendLine(line)
  }

  getGutterWidth() {
    return this.getParent().getGutterWidth()
  }

  toHakonCode() {
    const theme = this.getTheme()
    const left = this.getGutterWidth()

    // todo: add comments to Hakon? So we can annotate why we have valignTop
    const valignTop = "vertical-align top" // https://stackoverflow.com/questions/23529369/why-does-x-overflowhidden-cause-extra-space-below
    // todo: make tab cell width dynamic? smaller as more tabs open?s

    return `.TabsTreeComponent
 left ${left}px
 width calc(100% - ${left}px)
 height calc(100% - 30px)
 position absolute
.TabStub
 background ${theme.tabBackground}
 height 30px
 display inline-block
 max-width 150px
 text-overflow ellipsis
 white-space nowrap
 ${valignTop}
 overflow-x hidden
 box-sizing border-box
 position relative
 font-size 13px
 padding 0 15px
 color ${theme.foregroundColor}
 line-height 30px
 border-right 1px solid ${theme.borderColor}
 border-bottom 1px solid ${theme.borderColor}
 &:hover
  background ${theme.slightlyDarkerBackground}
 &:active
  background ${theme.activeTabColor}
 span
  position absolute
  top 10px
  right 5px
  display block
  font-size 12px
  line-height 10px
  text-align center
  opacity .25
  &:hover
   opacity 1
 &.mountedTab
  background ${theme.activeTabColor}
  border-bottom 0`
  }
}

module.exports = TabsTreeComponent
