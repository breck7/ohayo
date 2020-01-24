const AbstractDropDownMenuTreeComponent = require("./AbstractDropDownMenuTreeComponent.js")

class NewDropDownMenuTreeComponent extends AbstractDropDownMenuTreeComponent {
  getDropDownStumpCode() {
    const newProgram = `a New File
 clickCommand createNewBlankProgramCommand
 value untitled.ohayo
a New From Url
 clickCommand openCreateNewProgramFromUrlDialogCommand`
    const program = this.getRootNode().getMountedTab()
    if (!program) return newProgram

    return `${newProgram}
div
 class divider
a Clone File
 clickCommand cloneTabCommand`
  }

  getAnchorId() {
    return "newToggle"
  }
}

module.exports = NewDropDownMenuTreeComponent
