const { jtree } = require("jtree")
const { FullDiskPath } = require("./FilePaths.js")

// todo: add a file type. program in PanelTreeComponent will be a child off
// File. then we can have diskFile, remoteFile, folderFile, templateFile, localstorageFile, et cetera.,
// each with it's own storage strategy. they can extend tree notation. they can implment fetch. they can
// handle readonly, et cetera. google docs file. dropbox file. derivative file (for example, from a png).
// then the bytes of the file get turned into a program. there are Tree Languages flow/fire caddoes and then there
// are non-treeLanguage files like pngs and JS, et cetera, that we can build flow in-memory templates for.

// folders and files =>

class AbstractFile extends jtree.TreeNode {
  getFileLink() {
    return this.getLine()
  }

  getFilename() {
    return new FullDiskPath(this.getLine()).getFilename()
  }

  toFileObject() {
    const str = this.childrenToString()
    return {
      filename: this.getFilename(),
      link: this.getFileLink(),
      size: str.length,
      bytes: str
    }
  }
}

module.exports = AbstractFile
