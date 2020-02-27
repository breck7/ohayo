const tinycolor = require("tinycolor2")
const { jtree } = require("jtree")
/*NODE_JS_ONLY*/ const hakonNode = require("jtree/products/hakon.nodejs.js")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const CodeMirrorCss = require("./CodeMirrorCss.js")

const ThemeConstants = {}
ThemeConstants.dark = "dark"
ThemeConstants.workshop = "workshop"
ThemeConstants.white = "white"
ThemeConstants.glass = "glass"
ThemeConstants.clearGlass = "clearGlass"

class Theme {
  constructor(options = {}) {
    const { backgroundColor = "rgb(255,255,255)", foregroundColor = "black", fn = "lighten", selectionColor = "rgb(42, 89, 178)" } = options

    let grayStartColor = options.grayStartColor || foregroundColor
    this.backgroundColor = backgroundColor
    this.solidBackgroundColorOrTransparent = options.hasSolidBackground ? backgroundColor : "transparent"
    this.menuBackground = backgroundColor
    this.tabBackground = "transparent"
    this.programsBackground = backgroundColor
    this.bodyBackground = backgroundColor
    this.wallBackground = backgroundColor
    this.contextMenuBackground = backgroundColor
    this.tileBackgroundColor = backgroundColor
    this.tileShadow = "none"
    this.tileOpacity = 1

    this.menuTreeComponentColor = foregroundColor
    this.foregroundColor = foregroundColor

    this.lineColor = tinycolor(foregroundColor)
      .setAlpha(0.075)
      .toString()
    this.boxShadow = tinycolor(foregroundColor)
      .setAlpha(0.1)
      .toString()
    this.slightlyDarkerBackground = tinycolor(backgroundColor)
      .darken(5)
      .toString()
    this.darkerBackground = tinycolor(backgroundColor)
      .darken(10)
      .toString()

    this.activeTabColor = this.darkerBackground

    const alterGrayShades = amount =>
      tinycolor(grayStartColor)
        [fn](amount)
        .toString()

    this.darkBlack = alterGrayShades(20)
    this.mediumBlack = alterGrayShades(40)
    this.midGray = alterGrayShades(60)
    this.greyish = options.greyish || alterGrayShades(82)
    this.lightGrey = alterGrayShades(93)
    this.lightGrey = options.lightGrey || alterGrayShades(93)
    this.veryLightGrey = options.veryLightGrey || alterGrayShades(97)

    this.borderColor = this.greyish

    this.hoverBackground = selectionColor
    this.linkColor = selectionColor
    this.selectedOutline = tinycolor(selectionColor)
      .setAlpha(0.8)
      .toString()
    this.selectionBackground = tinycolor(selectionColor)
      .setAlpha(0.1)
      .toString()

    this.errorColor = "rgb(226, 120, 121)"
    this.successColor = "#4CAF50"
    this.warningColor = "orange"
    this.white = "#fff"

    this.fonts = `'San Francisco', 'Myriad Set Pro', 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif`

    this.modalDimmerBackground = tinycolor("#000")
      .setAlpha(0.4)
      .toString()

    // Pass values overwrite all
    Object.assign(this, options)

    // todo: cleanup
    this.enableTextSelect1 = this._enableTextSelect(1)
    this.enableTextSelect2 = this._enableTextSelect(2)
  }

  _enableTextSelect(indent) {
    return new jtree.TreeNode(`-moz-user-select text
-webkit-user-select text
-ms-user-select text
user-select text`).toString(indent)
  }

  getHeatColor(percent) {
    return `hsl(200, ${25 + percent * 75}%, ${20 + percent * 25}%)`
  }

  disableTextSelect(indent) {
    return new jtree.TreeNode(
      `-webkit-touch-callout none
-webkit-user-select none
-khtml-user-select none
-moz-user-select none
-ms-user-select none
user-select none`
    ).toString(indent)
  }

  hakonToCss(str) {
    const hakonProgram = new hakonNode(str)
    // console.log(hakonProgram.getAllErrors())
    return hakonProgram.compile()
  }
}

const Themes = {}

Themes[ThemeConstants.dark] = new Theme({
  hasSolidBackground: true,
  backgroundColor: "rgb(16, 16, 16)",
  foregroundColor: "#fff",
  fn: "darken"
})

Themes[ThemeConstants.workshop] = new Theme({
  hasSolidBackground: true,
  wallBackgroundImage: "url('images/transparenttextures.com/wine-cork.png')",
  wallBackground: "rgba(244,216,105,.4)",
  menuBackground: "#3B539A",
  tileOpacity: 0.95,
  tileShadow: "0 2px 4px rgba(33,33,33,.2)",
  menuTreeComponentColor: "white"
})

const glassColors = {
  hasSolidBackground: false,
  selectionColor: "rgba(46, 195, 212, .9)",
  bodyBackground: "linear-gradient(130deg, rgb(56, 114, 127), rgb(28, 98, 151) 45%, rgb(62, 73, 135))",
  backgroundColor: "rgba(0,0,0,.12)",
  contextMenuBackground: "rgba(0,0,0,.90)",
  tileBackgroundColor: "rgba(0,0,0,.12)",
  programsBackground: "transparent",
  boxShadow: "transparent",
  wallBackground: "transparent",
  activeTabColor: "transparent",
  lightGrey: "rgba(0,0,0,.16)",
  greyish: "rgba(0,0,0,.20)",
  veryLightGrey: "rgba(0,0,0,.12)",
  borderColor: "transparent",
  foregroundColor: "#eee"
}

const whiteColors = Object.assign({}, glassColors)
whiteColors.bodyBackground = "white"
whiteColors.foregroundColor = "black"
whiteColors.tileBackgroundColor = "transparent"

Themes[ThemeConstants.white] = new Theme(whiteColors)

Themes[ThemeConstants.glass] = new Theme(glassColors)

glassColors.tileBackgroundColor = "transparent"
Themes[ThemeConstants.clearGlass] = new Theme(glassColors)

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

code
 white-space pre

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
 min-height 200px
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
 position relative
 opacity ${theme.tileOpacity}
 background ${theme.tileBackgroundColor}
 margin 10px 15px
 box-shadow ${theme.tileShadow}
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
 .TileDropDownButton,.TileInsertBetweenButton
  opacity .4
  cursor pointer
  font-size 10px
  line-height 12px
 .TileDropDownButton
  &:hover
   opacity 1
 .TileInsertBetweenButton
  font-weight bold
  &:hover
   opacity 1
 &:hover
  z-index 2
 .TileSelectable
${theme.enableTextSelect2}
 .TileBody
  padding 15px 5px
  width 100%
  max-height 400px
  box-sizing border-box
  overflow scroll
 .TileFooter
  font-size 12px
  height 20px
  line-height 20px
  padding-left 5px
  padding-right 3px
  white-space nowrap
  color ${theme.midGray}
  background ${theme.tileBackgroundColor}
  overflow hidden
  position absolute
  max-width 100%
  box-sizing border-box
  bottom 0
  right 0
 iframe
  width 100%
  height 100%
  border 0`
  }
}

ThemeTreeComponent.defaultTheme = ThemeConstants.workshop
ThemeTreeComponent.Themes = Themes
ThemeTreeComponent.ThemeConstants = ThemeConstants

module.exports = ThemeTreeComponent
