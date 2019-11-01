const { jtree } = require("jtree")
const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const NewDropDownMenuTreeComponent = require("./NewDropDownMenuTreeComponent.js")
const OhayoConstants = require("./OhayoConstants.js")

class MenuTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      newDropDownMenu: NewDropDownMenuTreeComponent
    })
  }

  getDependencies() {
    return [{ getLineModifiedTime: () => this.getParent().getWindowSizeMTime() }]
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
 a
  padding-right 5px
  line-height 30px
  display inline-block
  color ${theme.menuTreeComponentColor}`
  }

  toStumpCode() {
    return `div
 class MenuTreeComponent ${this.constructor.name}
 a ${OhayoConstants.productName}
  stumpOnClickCommand toggleHelpCommand
 a New ▾
  id newToggle
  stumpOnClickCommand toggleAndRenderNewDropDownCommand`
  }
}

module.exports = MenuTreeComponent
