const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")

class TileContextMenuTreeComponent extends AbstractContextMenuTreeComponent {
  getContextMenuBodyStumpCode() {
    const targetTile = this.getRootNode().getTargetNode()
    return `a Reload
 stumpOnClickCommand fetchAndReloadFocusedTabCommand
a Copy tile with inputs
 tabindex -1
 stumpOnClickCommand copyTargetTileCommand
a Copy data as tree
 stumpOnClickCommand copyTargetTileDataAsTreeCommand
a Copy data as javascript
 stumpOnClickCommand copyTargetTileDataAsJavascriptCommand
a Copy data as tsv
 stumpOnClickCommand copyTargetTileDataCommand
 value \t
a Copy data as csv
 stumpOnClickCommand copyTargetTileDataCommand
 value ,
a Export data to csv file
 stumpOnClickCommand exportTargetTileDataCommand
a Export data to tree file
 stumpOnClickCommand exportTargetTileDataCommand
 value tree
${targetTile.getContextMenuStumpCode()}`
  }
}

module.exports = TileContextMenuTreeComponent
