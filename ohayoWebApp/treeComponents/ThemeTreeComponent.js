const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const CodeMirrorCss = require("../themes/CodeMirrorCss.js")

class ThemeTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    const theme = this.getTheme()
    return `styleTag ${CodeMirrorCss} .CodeMirror{color: ${theme.mediumBlack};} .CodeMirror .CodeMirror-gutters,.cm-s-oceanic-next .CodeMirror-gutters {background: ${theme.solidBackgroundColorOrTransparent}}`
  }
  toHakonCode() {
    const theme = this.getTheme()
    return `html,body,h1,h2,h3,h4,h5,h6,table,tr,td
 margin 0
 padding 0

html,body
 width 100%
 height 100%
 font-family ${theme.fonts}
 color ${theme.mediumBlack}

body
 overscroll-behavior-x none

html
 background ${theme.bodyBackground}

table
 border-collapse collapse
 border-spacing 0
 table-layout fixed

.ThemeTreeComponent
 display none

a
 cursor pointer
 text-decoration none
 color ${theme.linkColor}

::-webkit-scrollbar
 display none

.ui-resizable-handle
 position absolute
 font-size 0.1px
 display block
 -ms-touch-action none
 touch-action none

.ui-resizable-disabled
 .ui-resizable-handle
  display none

.ui-resizable-autohide
 .ui-resizable-handle
  display none

.leftButton,.rightButton
 background transparent
 border 0

.LintError,.LintErrorWithSuggestion,.LintCellTypeHints
 white-space pre
 color red
 background #e5e5e5

.LintCellTypeHints
 color black

.LintErrorWithSuggestion
 cursor pointer

.TileTextArea
 padding 5px
 width 100%
 height 100%
 box-sizing border-box
 outline 0
 border 0
 font-size 14px
 font-family ${theme.fonts}
 resize none

.rightButton
 float right

.LargeLabel
 font-size 12px
 color ${theme.midGray}
 position absolute
 left 26px
 top 2px

.LargeTileInput
 display block
 width 100%
 height 34px
 margin-top 4px
 padding 2px 20px
 font-size 14px
 line-height 1.428571429
 vertical-align middle
 box-sizing border-box
 color ${theme.darkBlack}
 background ${theme.backgroundColor}
 border 0

.dragOver
 opacity 0.5

#dragOverHelp
 position absolute
 font-size 36px
 width 100%
 height 100%
 z-index 300
 display flex
 align-items center
 justify-content center
 top 0
 left 0

.noTransition
 transition none

.SVGIcon
 fill ${theme.foregroundColor}
 cursor pointer

.buttonPrimary
 border-radius 2px
 cursor pointer
 border none
 padding 15px 32px
 text-align center
 text-decoration none
 font-size 16px
 color white
 background ${theme.successColor}

.divider
 background ${theme.lineColor}
 height 1px
 margin 10px 0
 width 100%

input,textarea
 background transparent
 color ${theme.foregroundColor}

.abstractTileTreeComponentNode
 position absolute
 box-shadow ${theme.tileShadow}
 opacity ${theme.tileOpacity}
 background ${theme.tileBackgroundColor}
 border 1px solid ${theme.borderColor}
 ol
  height 100%
  width 100%
  overflow scroll
  box-sizing border-box
  margin 0
 z-index 1
 ${theme.disableTextSelect(1)}
 &.TileMaximized
  z-index 2
 .TilePencilButton
  svg
   opacity 0
 .ui-resizable-se
  cursor se-resize
  width 36px
  height 36px
  box-sizing border-box
  right 1px
  bottom 1px
  opacity 0
  border-right 4px solid ${theme.darkerBackground}
  border-bottom 4px solid ${theme.darkerBackground}
  &:hover
   opacity 1
 &:hover
  background ${theme.backgroundColor}
  z-index 2
  .ui-resizable-se
   opacity .5
  .TilePencilButton
   svg
    opacity 1
    cursor pointer
    fill ${theme.greyish}
    &:hover
     fill ${theme.foregroundColor}
 .TileHeader,.TileFooter
  height 30px
  line-height 30px
  padding-left 5px
 .TileSelectable
${theme.enableTextSelect2}
 .TileBody
  padding 5px
  width 100%
  height calc(100% - 50px)
  box-sizing border-box
  overflow scroll
  &.HeaderLess
   height calc(100% - 20px)
 .TileGrabber
  width 100%
  height 10px
  cursor move
 .TileHeader
  font-size 14px
  text-transform uppercase
  text-align center
  border-bottom 1px solid ${theme.borderColor}
  overflow hidden
  text-overflow ellipsis
 .TileFooter
  font-size 12px
  white-space nowrap
  color ${theme.midGray}
  background ${theme.tileBackgroundColor}
  overflow hidden
  position absolute
  max-width 100%
  box-sizing border-box
  bottom 0
  left 0
 iframe
  width 100%
  height 100%
  border 0`
  }
}

module.exports = ThemeTreeComponent
