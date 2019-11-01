const AbstractDropDownMenuTreeComponent = require("./AbstractDropDownMenuTreeComponent.js")

class NewDropDownMenuTreeComponent extends AbstractDropDownMenuTreeComponent {
  getDropDownStumpCode() {
    const newProgram = `a New File
 stumpOnClickCommand createNewBlankProgramCommand
 value untitled.flow
a New From Url
 stumpOnClickCommand openCreateNewProgramFromUrlDialogCommand`
    const program = this.getRootNode().getMountedTab()
    if (!program) return newProgram

    return `${newProgram}
div
 class divider
a Clone File
 stumpOnClickCommand cloneTabCommand`
  }

  getAnchorId() {
    return "newToggle"
  }
}

module.exports = NewDropDownMenuTreeComponent
