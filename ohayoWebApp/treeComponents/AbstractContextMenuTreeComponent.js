const { jtree } = require("jtree")

const { AbstractTreeComponent, WillowConstants } = require("jtree/products/TreeComponentFramework.node.js")

class AbstractContextMenuTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    const theme = this.getTheme()
    return `.AbstractContextMenuTreeComponent
 position fixed
 overflow scroll
 max-height 100%
 z-index 221
 background ${theme.contextMenuBackground}
 border 1px solid ${theme.borderColor}
 box-shadow 0 1px 3px 0 ${theme.boxShadow}
 font-size 14px
 a
  display block
  padding 3px
  font-size 14px
  text-decoration none
  color ${theme.darkBlack}
  &:hover
   color ${theme.white}
   background ${theme.hoverBackground}`
  }

  toStumpCode() {
    return `div
 class AbstractContextMenuTreeComponent ${this.constructor.name}${jtree.TreeNode.nest(this.getContextMenuBodyStumpCode(), 1)}`
  }

  treeComponentDidMount() {
    const container = this.getStumpNode()
    const that = this
    const app = this.getRootNode()
    const willowBrowser = app.getWillowProgram()
    const bodyShadow = willowBrowser.getBodyStumpNode().getShadow()
    const unmountOnClick = function() {
      bodyShadow.offShadowEvent(WillowConstants.ShadowEvents.click, unmountOnClick) // todo: should we move this to before unmount?
      app.closeAllContextMenus()
    }
    setTimeout(() => bodyShadow.onShadowEvent(WillowConstants.ShadowEvents.click, unmountOnClick), 100) // todo: fix this.
    const event = app.getMouseEvent()
    const windowSize = willowBrowser.getWindowSize()
    container.setStumpNodeCss(this._getContextMenuPosition(windowSize.width, windowSize.height, event.clientX, event.clientY, container.getShadow()))
  }

  _getContextMenuPosition(windowWidth, windowHeight, x, y, shadow) {
    let boxTop = y
    let boxLeft = x
    const boxWidth = shadow.getShadowOuterWidth()
    const boxHeight = shadow.getShadowOuterHeight()
    const boxHeightOverflow = boxHeight + boxTop - windowHeight
    const boxRightOverflow = boxWidth + boxLeft - windowWidth

    // todo: instead of this change orientation
    if (boxHeightOverflow > 0) boxTop -= boxHeightOverflow

    if (boxRightOverflow > 0) boxLeft = x - boxWidth - 5

    if (boxTop < 0) boxTop = 0

    return {
      left: boxLeft,
      top: boxTop
    }
  }
}

module.exports = AbstractContextMenuTreeComponent
