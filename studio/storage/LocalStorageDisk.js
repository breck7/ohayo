const { jtree } = require("jtree")

const AbstractDisk = require("./AbstractDisk.js")
const StorageKeys = require("./StorageKeys.js")

const { FullFilePath } = require("./FilePaths.js")
const AbstractFile = require("./AbstractFile.js")

class LocalStorageFile extends AbstractFile {}

class LocalStorageDisk extends AbstractDisk {
  async readFiles() {
    return this.readFilesSync()
  }

  readFilesSync() {
    const app = this.getRootTreeComponent()
    return app
      .getStoreKeys()
      .filter(key => !StorageKeys.isKey(key))
      .filter(key => key.startsWith("/"))
      .map(filename => new LocalStorageFile(app.getFromStore(filename), this.getDisplayName() + filename))
  }

  getDisplayName() {
    return "localStorage"
  }

  async unlinkFile(fullPath) {
    this.getRootTreeComponent().removeValue(new FullFilePath(fullPath))
  }

  async getAvailablePermalink(permalink) {
    const app = this.getRootTreeComponent()
    return this.getFolder() + jtree.Utils.getAvailablePermalink(permalink, fullPath => app.getFromStore(this.getFolder() + fullPath) !== undefined)
  }

  async exists(fullPath) {
    return this.getRootTreeComponent().getFromStore(new FullFilePath(fullPath)) !== undefined
  }

  async writeFile(fullPath, newVersion) {
    this.getRootTreeComponent().storeValue(new FullFilePath(fullPath), newVersion)
  }

  async readFile(fullPath) {
    return this.getRootTreeComponent().getFromStore(new FullFilePath(fullPath))
  }
}

module.exports = LocalStorageDisk
