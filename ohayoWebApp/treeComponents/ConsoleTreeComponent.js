const { jtree } = require("jtree")

const { AbstractTreeComponent } = require("jtree/products/TreeComponentFramework.node.js")

class ConsoleTreeComponent extends AbstractTreeComponent {
  _getConsoleOutput() {
    const logLines = this._getMessageBuffer().map(message => message.childrenToString())
    logLines.reverse()
    return logLines.join("\n")
  }

  _getHeight() {
    return Math.floor((this.getRootNode().getBodyShadowDimensions().height - 60) * 0.3)
  }

  toHakonCode() {
    return `.consoleOutput
 height ${this._getHeight()}px
 overflow scroll
 font-family monospace
 white-space nowrap
 div
  margin-top 2px`
  }

  _getMessageBuffer() {
    const app = this.getRootNode()
    const tab = app.getMountedTab()
    return tab ? tab.getMessageBuffer() : app.getMessageBuffer()
  }

  getDependencies() {
    // 2 dependencies. the program and the programs message buffer.
    // let's call the latter the panel buffer for now.
    const deps = this.getParent().getDependencies()
    const messages = this._getMessageBuffer()
    if (messages.length) deps.push(messages.nodeAt(-1))
    else deps.push(new jtree.TreeNode())

    deps.push(this.getParent().getParent())
    return deps
  }

  toStumpCode() {
    return new jtree.TreeNode(`div
 class consoleOutput
 {messageBuffer}`).templateToString({ messageBuffer: this._getConsoleOutput() })
  }
}

module.exports = ConsoleTreeComponent
