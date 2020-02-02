const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

const Icons = require("../themes/Icons.js")

class TileToolbarTreeComponent extends AbstractTreeComponent {
  toHakonCode() {
    const theme = this.getTheme()
    return `.TileToolbarTreeComponent
 background ${theme.contextMenuBackground}
 border 1px solid ${theme.lineColor}
 font-size 12px
 position absolute
 padding 8px
 z-index 991
 min-width 300px
 top 100%
 right 0
 .TileCommandsDropDown
  a
   display block
 cursor pointer
 .TableInspection
  margin-top 5px
  border 1px solid ${theme.lineColor}
  td
   padding 2px 8px
   text-align left
  tr:nth-child(odd)
   background-color ${theme.veryLightGrey}
 svg
  fill ${theme.greyish}
  padding 1px 3px 3px 3px
  &:hover
   fill ${theme.foregroundColor}`
  }

  getTargetTile() {
    return this.getParent()
  }

  createProgramFromFocusedTileExampleCommand(uno, dos) {
    return this.getTargetTile().createProgramFromTileExampleCommand(uno, dos)
  }

  cloneFocusedTileCommand(uno, dos) {
    return this.getTargetTile().cloneTileCommand(uno, dos)
  }
  destroyFocusedTileCommand(uno, dos) {
    return this.getTargetTile().destroyTileCommand(uno, dos)
  }
  inspectFocusedTileCommand(uno, dos) {
    return this.getTargetTile().inspectTileCommand(uno, dos)
  }
  changeFocusedTileTypeCommand(uno, dos) {
    return this.getTargetTile().changeTileTypeCommand(uno, dos)
  }
  changeFocusedTileParentCommand(uno, dos) {
    return this.getTargetTile().changeParentCommand(uno, dos)
  }
  changeFocusedTileContentAndRenderCommand(uno, dos) {
    return this.getTargetTile().changeTileContentAndRenderCommand(uno, dos)
  }

  toStumpCode() {
    const tile = this.getTargetTile()
    const suggestions = this._getSuggestionsStumpCode()
    const exampleTile = tile.getExampleTemplate()
    let exampleTileButton = ""
    if (exampleTile) {
      exampleTileButton = `span ${Icons("function", 20)}
 title See an example program with '${tile.getFirstWord()}'
 clickCommand createProgramFromTileExampleCommand`
    }

    const links = `a Reload
 clickCommand fetchAndReloadFocusedTabCommand
a Copy tile with inputs
 tabindex -1
 clickCommand copyTargetTileCommand
a Copy data as tree
 clickCommand copyTargetTileDataAsTreeCommand
a Copy data as javascript
 clickCommand copyTargetTileDataAsJavascriptCommand
a Copy data as tsv
 clickCommand copyTargetTileDataCommand
 value \t
a Copy data as csv
 clickCommand copyTargetTileDataCommand
 value ,
a Export data to csv file
 clickCommand exportTargetTileDataCommand
a Export data to tree file
 clickCommand exportTargetTileDataCommand
 value tree`

    return new jtree.TreeNode(`div
 class TileToolbarTreeComponent
 span ${Icons("copy", 20)}
  title Duplicate Tile
  clickCommand cloneTileCommand
 span ${Icons("trash", 20)}
  title Delete Tile
  clickCommand destroyTileCommand
 span ${Icons("inspector", 20)}
  title Debug Tile
  clickCommand inspectTileCommand
 {exampleTileButton}
 div
  class TileCommandsDropDown
  {links}`).templateToString({ exampleTileButton, links})
  }

  _getSuggestionsStumpCode() {
    //return `div Add Suggested:`
    return "" //todo:
  }
}

module.exports = TileToolbarTreeComponent
