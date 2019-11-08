const recursive = require("recursive-readdir")
const recursiveReadSync = require("recursive-readdir-sync")
const fs = require("mz/fs")

// todo: add tests
class DiskReader {
  constructor(options) {
    this._files = options.files
    this._path = options.path && options.path.replace(/^file\:\/\//, "")
    this._filesLimit = options.limit || 5000
    this._recursive = options.recursive
    this._stats = options.stats
    this._lineStats = options.lineStats
    this._readAll = options.readAll
    this._maxFileSize = 100000
  }

  _getFilesRecursive() {
    return new Promise((resolve, reject) => recursive(this._path, (err, files) => (err ? reject(err) : resolve(files))))
  }

  async getFilesArray() {
    let files = await this._getFilesWithLimit()
    files = this._stats ? await this._addStats(files) : await this._addPaths(files)

    if (this._lineStats) files = await this._addLineStats(files)

    if (this._readAll) files = await this._addData(files)

    return files
  }

  getRecursiveSync() {
    // node: this only implements a partial bit of the api
    return recursiveReadSync(this._path)
  }

  _addPaths(files) {
    return files.map(file => {
      return {
        path: file
      }
    })
  }

  _addData(files) {
    // todo: filter binary files
    files = files.filter(file => file.isDirectory === false).filter(file => file.bytes < this._maxFileSize)
    return Promise.all(files.map(this._addDataForFile))
  }

  _addLineStats(files) {
    // todo: filter binary files
    files = files.filter(file => file.isDirectory === false).filter(file => file.bytes < this._maxFileSize)
    return Promise.all(files.map(this._addLineStatsForFile))
  }

  async _addDataForFile(file) {
    const str = await fs.readFile(file.path, "utf8")
    file.data = str
    return file
  }

  async _addLineStatsForFile(file) {
    const str = await fs.readFile(file.path, "utf8")
    //file.content = str
    const lines = str.match(/\n/g)
    const words = str.split(/\b/g)
    file.lines = lines ? lines.length : 1
    file.words = words ? Math.round(words.length / 2) : 0
    file.wordsPerLine = (file.words / file.lines).toFixed(1)
    return file
  }

  _addStats(files) {
    return Promise.all(files.map(this._getFileStats))
  }

  static _getExtension(path) {
    // todo: handle no extension.
    const fileName = path.split("/").pop()
    return fileName.includes(".") ? fileName.split(".").pop() : ""
  }

  async _getFileStats(abspath) {
    const stat = await fs.stat(abspath)
    const obj = {}
    obj.name = abspath.split("/").pop()
    obj.path = abspath
    obj.link = "file://" + abspath
    obj.isDirectory = stat.isDirectory()
    obj.extension = obj.isDirectory ? "directory" : DiskReader._getExtension(abspath)
    obj.atime = stat.atime
    obj.mtime = stat.mtime
    obj.ctime = stat.ctime
    obj.bytes = stat.size
    return obj
  }

  _fetchFiles() {
    return this._recursive ? this._getFilesRecursive() : this._getFilesFlat()
  }

  async _getFilesWithLimit() {
    const fetchPromise = this._files ? Promise.resolve(this._files) : this._fetchFiles()
    const files = await fetchPromise
    return files.slice(0, this._filesLimit)
  }

  async _getFilesFlat() {
    // todo: seems to throw on symlinks
    const stat = await fs.stat(this._path)

    if (!stat.isDirectory()) return [this._path]

    const files = await fs.readdir(this._path)
    return files.map(filename => this._path.replace(/\/$/, "") + "/" + filename)
  }
}

module.exports = DiskReader
