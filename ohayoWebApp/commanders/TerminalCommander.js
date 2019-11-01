const { AbstractCommander } = require("jtree/products/TreeComponentFramework.node.js")

class TerminalCommander extends AbstractCommander {
  async saveChangesCommand() {
    const terminal = this.getTarget()
    // tood: this is broken. needs to unmount first.
    // todo: add a patch method to tree.
    if (terminal.hasChanges()) await terminal._getTab().autosaveAndReloadWith(terminal.getCode())
  }

  async executeLineCommand(lineNumber) {
    const terminal = this.getTarget()
    const program = terminal._makeProgramFromLineNumber(lineNumber)
    let result = await program.execute(terminal.getRootNode())

    if (typeof result !== "string") result = result.join("\n")

    terminal._getTab().logMessageText(encodeURIComponent(result))
    terminal.getRootNode().renderApp()
  }

  async executeFirstLineCommand() {
    return this.executeLineCommand(0)
  }

  async compileFirstLineCommand() {
    return this.compileLineCommand(0)
  }

  _compileLine(lineNumber) {
    const terminal = this.getTarget()
    const program = terminal._makeProgramFromLineNumber(lineNumber)
    const grammarProgram = program.getDefinition()
    return program.compile()
  }

  async compileLineCommand(lineNumber) {
    const terminal = this.getTarget()
    terminal._getTab().logMessageText(this._compileLine(lineNumber))
    terminal.getRootNode().renderApp()
  }
}

module.exports = TerminalCommander
