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
 left 0
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
    let tileHelp = ""
    if (exampleTile) {
      tileHelp = `
 span ${Icons("function", 20)}
  title See an example program with '${tile.getFirstWord()}'
  stumpOnClickCommand createProgramFromTileExampleCommand`
    }
    const hints = tile.getDefinition().getLineHints()

    // todo: cleanup

    return (
      `div
 class TileToolbarTreeComponent
 span ${Icons("copy", 20)}
  title Duplicate Tile
  stumpOnClickCommand cloneTileCommand
 span ${Icons("trash", 20)}
  title Delete Tile
  stumpOnClickCommand destroyTileCommand
 span ${Icons("inspector", 20)}
  title Debug Tile
  stumpOnClickCommand inspectTileCommand` +
      tileHelp +
      `
 div ${hints}` +
      jtree.TreeNode.nest(this._getFormStumpCode(), 1)
    )
  }

  _getTileTypeDropdownStumpCode() {
    const tile = this.getTargetTile()
    const tileNames = tile
      .getRootNode()
      .getGrammarProgram()
      ._getInScopeNodeTypeIds()
      .filter(name => !name.includes("_") && !name.startsWith("@"))
    tileNames.sort()
    const selectedValue = tile.getFirstWord()
    const options = tileNames
      .map(
        option =>
          ` option ${option}
  value ${option}
  ${selectedValue === option ? "selected" : "stumpNoOp"}`
      )
      .join("\n")
    return `select
 stumpOnChangeCommand changeTileTypeCommand
${options}`
  }

  _getParentDropdownStumpCode() {
    const tile = this.getTargetTile()
    const tilesProgram = tile.getRootNode()
    const tilesParent = tile.getParent()

    const options = tilesProgram
      .getTiles()
      .filter(t => t !== tile)
      .map(tile => {
        return {
          name: tile.getFirstWordPathRelativeTo(tilesProgram),
          value: tile.getPathVectorRelativeTo(tilesProgram).join(" "),
          isParent: tile === tilesParent
        }
      })
      .map(
        option =>
          ` option ${option.name}
  value ${option.value}
  ${option.isParent ? "selected" : "stumpNoOp"}`
      )
      .join("\n")

    return `select
 stumpOnChangeCommand changeParentCommand
 option (top)
  value 
  ${tilesParent.isRoot() ? "selected" : "stumpNoOp"}${options ? "\n" + options : ""}`
  }

  _getSuggestionsStumpCode() {
    //return `div Add Suggested:`
    return "" //todo:
  }

  _getFormStumpCode() {
    const tile = this.getTargetTile()

    const formFields = []
    formFields.unshift(["parent", this._getParentDropdownStumpCode()])
    formFields.unshift(["type", this._getTileTypeDropdownStumpCode()])
    formFields.unshift([
      "content",
      `input
 stumpOnChangeCommand changeTileContentAndRenderCommand
 value ${tile.getContent() || ""}`
    ])

    const html = formFields
      .map(
        control =>
          `  tr
   td ${control[0]}
   td${jtree.TreeNode.nest(control[1], 4)}`
      )
      .join("\n")

    let colTable = !tile.getOutputOrInputTable
      ? ""
      : tile
          .getOutputOrInputTable()
          .getColumnNamesAndTypes()
          .map(
            col => `  tr
  td ${col.Column}
  td ${col.JTableType}
  td ${col.JavascriptType}`
          )
          .join("\n")

    return `form
 table${html ? "\n" + html : html}
div Output Table Columns:
table
 class TableInspection
 thead
  tr
   th Column
   th Type
   th JavascriptType
 tbody
${colTable}`
  }
}

module.exports = TileToolbarTreeComponent
