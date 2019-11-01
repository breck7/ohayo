const { FolderPath } = require("./FilePaths.js")

class AbstractDisk {
  constructor(rootTreeComponent) {
    this._rootTreeComponent = rootTreeComponent
  }

  getPathBase() {
    return this.getDisplayName() + this.getFolder()
  }

  getRootTreeComponent() {
    return this._rootTreeComponent
  }

  getFolder() {
    return this._folder || "/"
  }

  setFolder(folderPath) {
    this._folder = new FolderPath(folderPath).toString()
    return this
  }
}

module.exports = AbstractDisk
