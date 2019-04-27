const DiskReader = require("./DiskReader.js")
const fs = require("fs")

const util = {}

util.removeFileExtension = filename => (filename ? filename.replace(/\.[^\.]+$/, "") : "")
util.getFileExtension = (url = "") => {
  url = url.match(/\.([^\.]+)$/)
  return (url && url[1]) || ""
}

util.getAvailablePermalink = (permalink, doesFileExistSyncFn) => {
  const extension = util.getFileExtension(permalink)
  permalink = util.removeFileExtension(permalink)
  const originalPermalink = permalink
  let num = 2
  let suffix = ""
  let filename = `${originalPermalink}${suffix}.${extension}`

  while (doesFileExistSyncFn(filename)) {
    filename = `${originalPermalink}${suffix}.${extension}`
    suffix = "-" + num
    num++
  }

  return filename
}

module.exports = app => {
  app.get("/serverStorage.list", async (req, res) => {
    const options = {
      path: req.query.folder,
      stats: true,
      readAll: true, // todo: this is bad. what if you have a big binary?
      recursive: false
    }
    const files = await new DiskReader(options).getFilesArray()
    res.send(files)
  })

  app.post("/serverStorage.delete", (req, res) => {
    fs.unlink(req.body.fullPath, () => res.send("ok"))
  })

  app.post("/serverStorage.exists", (req, res) => {
    fs.exists(req.body.fullPath, result => res.send(result))
  })

  app.post("/serverStorage.read", (req, res) => {
    fs.readFile(req.body.fullPath, "utf8", (err, data) => res.send(data))
  })

  app.post("/serverStorage.getAvailablePermalink", (req, res) => {
    res.send(util.getAvailablePermalink(req.body.permalink, fullPath => fs.existsSync(fullPath)))
  })

  app.post("/serverStorage.write", (req, res) => {
    fs.writeFile(req.body.fullPath, req.body.newVersion, "utf8", (err, data) => {
      res.send("ok")
    })
  })
}
