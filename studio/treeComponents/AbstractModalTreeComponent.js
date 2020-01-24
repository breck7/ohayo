const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

class AbstractModalTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    const theme = this.getTheme()
    return `${super.toHakonCode()}
.modalBackground
 position fixed
 top 0
 left 0
 width 100%
 height 100%
 z-index 1000
 display flex
 padding-top 50px
 align-items baseline
 justify-content center
 box-sizing border-box
 background ${theme.modalDimmerBackground}

.modalContent
 background ${theme.contextMenuBackground}
 color ${theme.foregroundColor}
 box-shadow 0px 0px 2px ${theme.boxShadow}
 padding 20px
 position relative
 min-width 600px
 max-width 800px
 max-height 90%
 white-space nowrap
 text-overflow ellipsis
 overflow-x hidden
 overflow-y scroll
 textarea
  margin-bottom 10px
  white-space pre
 pre
${theme.enableTextSelect2}

.modalClose
 position absolute
 top 10px
 right 10px
 cursor pointer`
  }

  toStumpCode() {
    return new jtree.TreeNode(`section
 clickCommand unmountAndDestroyCommand
 class modalBackground
 section
  clickCommand stopPropagationCommand
  class modalContent
  a X
   id closeModalX
   clickCommand unmountAndDestroyCommand
   class modalClose
  {modelStumpCode}`).templateToString({ modelStumpCode: this.getModalStumpCode() })
  }
}

module.exports = AbstractModalTreeComponent
