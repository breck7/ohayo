class AbstractPath {
  constructor(path) {
    this._checkPath(path)
    this._path = path
  }
  _checkPath() {}
  toString() {
    return this._path.toString()
  }
}

class FullFilePath extends AbstractPath {
  _checkPath(fullPath) {
    if (!fullPath.startsWith("/")) throw new Error(`File fullPath "${fullPath}" does not begin with /.`)
    if (fullPath.endsWith("/")) throw new Error(`File fullPath "${fullPath}" cannot end with /.`)
    if (fullPath.includes("//")) throw new Error(`File fullPath "${fullPath}" cannot include //`)
  }
}

class FolderPath extends AbstractPath {
  _checkPath(folderPath) {
    if (folderPath.includes("//")) throw new Error(`File folderPath "${folderPath}" cannot include //`)
    if (!folderPath.startsWith("/") || !folderPath.endsWith("/")) throw new Error(`Bad folder: '${folderPath}'. Folder must start and end with /.`)
  }
}

class AbstractPathWithApp {
  constructor(path, app) {
    this._checkPath(path, app)
    this._path = path
    this._app = app
  }

  getDiskId() {
    return this._path.slice(0).split("/")[0]
  }

  getFilePath() {
    return this._path.replace(/^[^\/]+\//, "/")
  }

  toString() {
    return this._path.toString()
  }
}

class FullFolderPath extends AbstractPathWithApp {
  _checkPath(fullFolderPath, app) {
    if (fullFolderPath.includes("//")) throw new Error(`File fullFolderPath "${fullFolderPath}" cannot include //`)
    if (!fullFolderPath.endsWith("/")) throw new Error(`Bad fullFolderPath: '${fullFolderPath}'. Must end with /`)
    if (fullFolderPath.startsWith("/")) throw new Error(`Bad fullFolderPath: '${fullFolderPath}'. Cannot start with /`)
    if (!fullFolderPath.includes("/")) throw new Error(`Bad fullFolderPath: '${fullFolderPath}' must have a disk id and a folder path part. No / detected.`)
  }

  async getFiles() {
    return this._app.getDisks()[this.getDiskId()].readFiles(this.getFolderPath())
  }

  getFolderPath() {
    return this.getFilePath()
  }
}

class FullDiskPath extends AbstractPathWithApp {
  _checkPath(fullDiskFilePath, app) {
    if (fullDiskFilePath.includes("//")) throw new Error(`File fullDiskFilePath "${fullDiskFilePath}" cannot include //`)
    if (fullDiskFilePath.endsWith("/")) throw new Error(`Bad fullDiskFilePath: '${fullDiskFilePath}'. Cannot end with /`)
    if (fullDiskFilePath.startsWith("/")) throw new Error(`Bad fullDiskFilePath: '${fullDiskFilePath}'. Cannot start with /`)
    if (!fullDiskFilePath.includes("/")) throw new Error(`Bad fullDiskFilePath: '${fullDiskFilePath}' must have a disk id and a path part. No / detected.`)
  }

  getWithoutFilename() {
    return this._path.replace(/\/[^\/]+$/, "/")
  }

  getFilename() {
    return this._path.split("/").pop()
  }
}

class FileHandle {
  constructor(fullDiskFilePath, app) {
    this._fullDiskFilePath = new FullDiskPath(fullDiskFilePath)
    this._app = app
  }

  _getDisk() {
    return this._app.getDisks()[this._fullDiskFilePath.getDiskId()]
  }

  unlinkFile() {
    return this._getDisk().unlinkFile(this._fullDiskFilePath.getFilePath())
  }

  readFile() {
    return this._getDisk().readFile(this._fullDiskFilePath.getFilePath())
  }

  writeFile(newVersion) {
    return this._getDisk().writeFile(this._fullDiskFilePath.getFilePath(), newVersion)
  }
}

module.exports = { FullFilePath, FolderPath, FullFolderPath, FullDiskPath, FileHandle }
