const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const StudioConstants = require("./StudioConstants.js")
const TabsTreeComponent = require("./TabsTreeComponent.js")

class LogoTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    return `a ${StudioConstants.productName}
 clickCommand toggleHelpCommand
 class LogoTreeComponent`
  }
}

class NewButtonTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    return `a &nbsp;+
 id newButton
 class NewButtonTreeComponent
 clickCommand createNewBlankProgramCommand
 value untitled.ohayo`
  }
}

class MenuTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      logo: LogoTreeComponent,
      tabs: TabsTreeComponent,
      newButton: NewButtonTreeComponent
    })
  }

  toHakonCode() {
    const theme = this.getTheme()
    return `.MenuTreeComponent
 ${theme.disableTextSelect(1)}
 font-size 14px
 padding-left 5px
 box-sizing border-box
 right 0
 left 0
 position relative
 height 30px
 z-index 92
 white-space nowrap
 background ${theme.menuBackground}
 color ${theme.darkBlack}
 display flex
 .LogoTreeComponent,.NewButtonTreeComponent
  padding-right 5px
  line-height 30px
  display inline-block
  color ${theme.menuTreeComponentColor}`
  }
}

module.exports = MenuTreeComponent
