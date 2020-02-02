const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

class AbstractDropDownMenuTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    const theme = this.getTheme()
    return `
.subdued
 color ${theme.midGray}

.dropdownMenu
 min-width 200px
 position absolute
 top 0
 left 0
 z-index 100
 padding 7px 0
 background ${theme.contextMenuBackground}
 border 1px solid ${theme.borderColor}
 box-shadow 0 1px 3px 0 ${theme.boxShadow}
 .message
  line-height 30px
  padding 0 10px
 a
  color ${theme.foregroundColor}
  display block
  line-height 30px
  padding 0 10px
  &:hover
   background ${theme.hoverBackground}
   color ${theme.white}`
  }

  treeComponentDidMount() {
    const app = this.getRootNode()
    const willowBrowser = app.getWillowBrowser()
    const bodyStumpNode = willowBrowser.getBodyStumpNode()
    const bodyShadow = bodyStumpNode.getShadow()
    const unmountOnClick = function() {
      bodyShadow.offShadowEvent("click", unmountOnClick)
      app.closeAllDropDownMenusCommand()
    }
    setTimeout(() => bodyShadow.onShadowEvent("click", unmountOnClick), 100) // todo: fix this.
  }

  toStumpCode() {
    const anchorId = this.getAnchorId()
    const buttonStumpNode = this.getParent()
      .getStumpNode()
      .findStumpNodeByChild("id " + anchorId)
    const buttonStumpNodeShadow = buttonStumpNode.getShadow()
    const left = buttonStumpNodeShadow.getShadowPosition().left

    return new jtree.TreeNode(`div
 style top: 30px; left: ${left}px;
 class dropdownMenu
 {dropDownStump}`).templateToString({ dropDownStump: this.getDropDownStumpCode() })
  }
}

module.exports = AbstractDropDownMenuTreeComponent
