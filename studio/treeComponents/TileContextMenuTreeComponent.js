const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")

class TileContextMenuTreeComponent extends AbstractContextMenuTreeComponent {
  getContextMenuBodyStumpCode() {
    const targetTile = this.getRootNode().getTargetNode()
    return `a Reload
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
 value tree
${targetTile.getContextMenuStumpCode()}`
  }
}

module.exports = TileContextMenuTreeComponent
