const jtree = require("jtree")
const DiskReader = require("./DiskReader.js")

const DiskConstants = {}
DiskConstants.getPath = "/disk"
DiskConstants.readPath = "/disk.read"

module.exports = app => {
  app.get(DiskConstants.getPath, async (req, res) => {
    const path = req.query.path || app.cwd
    const options = {
      path: path,
      stats: true,
      lineStats: req.query.lineStats === "true",
      recursive: req.query.recursive === "true"
    }
    try {
      const files = await new DiskReader(options).getFilesArray()
      const tree = new jtree.TreeNode(files)
      res.send(tree.toTsv())
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  })

  app.get(DiskConstants.readPath, (req, res) => res.sendFile(req.query.path))
}
