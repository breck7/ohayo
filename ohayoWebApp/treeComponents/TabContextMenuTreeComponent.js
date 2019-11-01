const AbstractContextMenuTreeComponent = require("./AbstractContextMenuTreeComponent.js")

class TabContextMenuTreeComponent extends AbstractContextMenuTreeComponent {
  getContextMenuBodyStumpCode() {
    return this.getRootNode()
      .getMountedTab()
      .getContextMenuCommandsStumpCode()
  }
}

module.exports = TabContextMenuTreeComponent
