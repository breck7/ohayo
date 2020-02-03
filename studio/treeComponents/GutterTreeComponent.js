const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const StudioConstants = require("./StudioConstants.js")
const ConsoleTreeComponent = require("./ConsoleTreeComponent.js")
const BasicTerminalTreeComponent = require("./BasicTerminalTreeComponent.js")
const CodeMirrorTerminalTreeComponent = require("./CodeMirrorTerminalTreeComponent.js")

class GutterTreeComponent extends AbstractTreeComponent {
  createParser() {
    return new jtree.TreeNode.Parser(undefined, {
      console: ConsoleTreeComponent,
      terminal: this.isNodeJs() ? BasicTerminalTreeComponent : CodeMirrorTerminalTreeComponent
    })
  }

  get _gutterWidth() {
    return this.getWord(1)
  }

  setGutterWidth(newWidth) {
    this.setWord(1, newWidth)
    return this
  }

  toHakonCode() {
    const theme = this.getTheme()
    return `${super.toHakonCode()}
.Gutter
 width ${this._gutterWidth}px
 left 0
 background ${theme.backgroundColor}
 border-color ${theme.borderColor}
 position absolute
 border-right-width 1px
 border-right-style solid
 box-sizing border-box
 top 0
 bottom 0
 padding 20px
 .closeGutter
  cursor pointer
  position absolute
  top 10px
  right 5px
  display block
  font-size 12px
  line-height 10px
  text-align center
  opacity .25
  &:hover
   opacity 1`
  }

  toStumpCode() {
    return `div
 class Gutter
 span <>
  class closeGutter
  clickCommand toggleGutterWidthCommand`
  }
}

module.exports = GutterTreeComponent
