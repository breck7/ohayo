const tinycolor = require("tinycolor2")
const { jtree } = require("jtree")
/*NODE_JS_ONLY*/ const hakonNode = require("jtree/products/hakon.nodejs.js")

const ThemeConstants = require("./ThemeConstants.js")

class Theme {
  constructor(options = {}) {
    const { backgroundColor = "rgb(255,255,255)", foregroundColor = "black", fn = "lighten", selectionColor = "rgb(42, 89, 178)" } = options

    let grayStartColor = options.grayStartColor || foregroundColor
    this.backgroundColor = backgroundColor
    this.solidBackgroundColorOrTransparent = options.hasSolidBackground ? backgroundColor : "transparent"
    this.menuBackground = backgroundColor
    this.tabBackground = backgroundColor
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
  }

  enableTextSelect(indent) {
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
  tileShadow: "0 3px 5px rgba(33,33,33,.3)",
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

module.exports = Themes
