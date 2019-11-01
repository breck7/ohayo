const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const CodeMirrorCss = require("../themes/CodeMirrorCss.js")

class ThemeTreeComponent extends AbstractTreeComponent {
  toStumpCode() {
    const theme = this.getTheme()
    return `styleTag ${CodeMirrorCss} .CodeMirror{color: ${theme.mediumBlack};} .CodeMirror .CodeMirror-gutters,.cm-s-oceanic-next .CodeMirror-gutters {background: ${theme.solidBackgroundColorOrTransparent}}`
  }
  toHakonCode() {
    const meyerReset = `html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,audio,video
 margin 0
 padding 0
 border 0
 font-size 100%
 font inherit
 vertical-align baseline
article,aside,figcaption,figure,footer,header,hgroup,menu,nav,section
 display block
body
 line-height 1.3
 overscroll-behavior-x none
ol,ul
 list-style none
table
 border-collapse collapse
 border-spacing 0`

    const theme = this.getTheme()
    return `${meyerReset}

html,body
 width 100%
 height 100%
 margin 0
 padding 0
 font-family ${theme.fonts}
 color ${theme.mediumBlack}

html
 background ${theme.bodyBackground}

table
 padding 0
 margin 0
 border-collapse collapse
 border-spacing 0
 table-layout fixed
 tr,td
  padding 0
  margin 0

.ThemeTreeComponent
 display none

h1
 font-size 200%

h2
 font-size 166%

h3
 font-size 133%

h4
 font-size 120%

p
 margin 1em 0

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
${theme.enableTextSelect(2)}
 .TileBody
  padding 5px
  width 100%
  height calc(100% - 80px)
  box-sizing border-box
  overflow scroll
  &.BodyOnly
   height calc(100% - 20px)
  &.HeaderLess
   height calc(100% - 50px)
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
  overflow hidden
 iframe
  width 100%
  height 100%
  border 0`
  }
}

module.exports = ThemeTreeComponent
