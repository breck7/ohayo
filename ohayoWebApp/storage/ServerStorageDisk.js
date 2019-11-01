const AbstractDisk = require("./AbstractDisk.js")
const { FullFilePath } = require("./FilePaths.js")
const AbstractFile = require("./AbstractFile.js")

class ServerStorageFile extends AbstractFile {}

// todo: use same constants file on serverside.

class ServerStorageDisk extends AbstractDisk {
  _getWillow() {
    return this.getRootTreeComponent().getWillowProgram()
  }

  async _httpPostUrl(method, options) {
    const response = await this._getWillow().httpPostUrl("/serverStorage." + method, options)
    return response.text
  }

  getDisplayName() {
    return this._getWillow().getHost()
  }

  async readFiles(folder = this.getFolder()) {
    // todo: speed tests/checks
    const response = await this._getWillow().httpGetUrl("/serverStorage.list", { folder: folder })
    return response.body.map(file => new ServerStorageFile(file.data, this.getDisplayName() + folder + file.name))
  }

  async getAvailablePermalink(permalink) {
    const fullPath = this.getFolder() + permalink
    const res = await this._httpPostUrl("getAvailablePermalink", { permalink: new FullFilePath(fullPath).toString() })
    return res
  }

  async unlinkFile(fullPath) {
    const res = await this._httpPostUrl("delete", { fullPath: new FullFilePath(fullPath).toString() })
    return res
  }

  async writeFile(fullPath, newVersion) {
    // todo: speed tests/checks
    try {
      const res = await this._httpPostUrl("write", { fullPath: new FullFilePath(fullPath).toString(), newVersion: newVersion })
      return res
    } catch (err) {
      console.error(err)
      throw new Error("Save failed!")
    }
  }

  async exists(fullPath) {
    const res = await this._httpPostUrl("exists", { fullPath: new FullFilePath(fullPath).toString() })
    return res.toString() === "true"
  }

  async readFile(fullPath) {
    // todo: speed tests/checks
    const res = await this._httpPostUrl("read", { fullPath: new FullFilePath(fullPath).toString() })
    return res
  }
}

module.exports = ServerStorageDisk
