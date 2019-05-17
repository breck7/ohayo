const DiskReader = require("./DiskReader.js")
const fs = require("fs")

const util = {}

const ServerStorageConstants = {}
ServerStorageConstants.routes = {}
ServerStorageConstants.routes.list = "/serverStorage.list"
ServerStorageConstants.routes.delete = "/serverStorage.delete"
ServerStorageConstants.routes.exists = "/serverStorage.exists"
ServerStorageConstants.routes.getAvailablePermalink = "/serverStorage.getAvailablePermalink"
ServerStorageConstants.routes.read = "/serverStorage.read"
ServerStorageConstants.routes.write = "/serverStorage.write"

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
  app.get(ServerStorageConstants.routes.list, async (req, res) => {
    const options = {
      path: req.query.folder,
      stats: true,
      readAll: true, // todo: this is bad. what if you have a big binary?
      recursive: false
    }
    const files = await new DiskReader(options).getFilesArray()
    res.send(files)
  })

  app.post(ServerStorageConstants.routes.delete, (req, res) => {
    fs.unlink(req.body.fullPath, () => res.send("ok"))
  })

  app.post(ServerStorageConstants.routes.exists, (req, res) => {
    fs.exists(req.body.fullPath, result => res.send(result))
  })

  app.post(ServerStorageConstants.routes.read, (req, res) => {
    fs.readFile(req.body.fullPath, "utf8", (err, data) => res.send(data))
  })

  app.post(ServerStorageConstants.routes.getAvailablePermalink, (req, res) => {
    res.send(util.getAvailablePermalink(req.body.permalink, fullPath => fs.existsSync(fullPath)))
  })

  app.post(ServerStorageConstants.routes.write, (req, res) => {
    fs.writeFile(req.body.fullPath, req.body.newVersion, "utf8", (err, data) => res.send("ok"))
  })
}
