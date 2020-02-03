const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const { FullDiskPath } = require("../storage/FilePaths.js")

const { TabTreeComponent } = require("./TabTreeComponent.js")
const StudioConstants = require("./StudioConstants.js")

class TabsTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      tab: TabTreeComponent
    })
  }

  getOpenTabs() {
    return this.getChildrenByNodeConstructor(TabTreeComponent)
  }

  addTab(url) {
    const line = `tab unmounted ${new FullDiskPath(url).toString()}`
    return this.appendLine(line)
  }

  toHakonCode() {
    const theme = this.getTheme()
    // todo: add comments to Hakon? So we can annotate why we have valignTop
    const valignTop = "vertical-align top" // https://stackoverflow.com/questions/23529369/why-does-x-overflowhidden-cause-extra-space-below
    // todo: make tab cell width dynamic? smaller as more tabs open?s

    return `.TabsTreeComponent
 display inline-block
.TabStub
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
 &:hover
  background rgba(0,0,0,.1)
 &:active
  background rgba(0,0,0,.2)
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
  background rgba(0,0,0,.2)
  border-bottom 0`
  }
}

module.exports = TabsTreeComponent
