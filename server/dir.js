const jtree = require("jtree")

const DiskReader = require("./DiskReader.js")

module.exports = app => {
  app.get("/dir", async (req, res) => {
    const path = req.query.path || __dirname
    const options = {
      path: path,
      stats: true,
      lineStats: true,
      recursive: true
    }
    const files = await new DiskReader(options).getFilesArray()
    const tree = new jtree.TreeNode(files)
    res.send(tree.toTsv())
  })
}
