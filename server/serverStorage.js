const DiskReader = require("./DiskReader.js")
const fs = require("fs")
const os = require("os")

const storageFolder = os.homedir() + "/ohayo-programs/"

if (!fs.existsSync(storageFolder)) fs.mkdirSync(storageFolder)

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
      path: storageFolder,
      stats: true,
      readAll: true,
      recursive: false
    }
    const files = await new DiskReader(options).getFilesArray()
    res.send(files)
  })

  app.post("/serverStorage.delete", (req, res) => {
    const filename = storageFolder + req.body.filename
    fs.unlink(filename, () => res.send("ok"))
  })

  app.post("/serverStorage.exists", (req, res) => {
    const filename = storageFolder + req.body.filename
    fs.exists(filename, result => res.send(result))
  })

  app.post("/serverStorage.move", (req, res) => {
    const oldName = storageFolder + req.body.oldName
    const newName = storageFolder + req.body.newName
    fs.rename(oldName, newName, () => res.send("ok"))
  })

  app.post("/serverStorage.read", (req, res) => {
    const filename = storageFolder + req.body.filename
    fs.readFile(filename, "utf8", (err, data) => res.send(data))
  })

  app.post("/serverStorage.getAvailablePermalink", (req, res) => {
    res.send(util.getAvailablePermalink(req.body.permalink, filename => fs.existsSync(storageFolder + filename)))
  })

  app.post("/serverStorage.write", (req, res) => {
    const filename = storageFolder + req.body.filename
    const newVersion = req.body.newVersion
    fs.writeFile(filename, newVersion, "utf8", (err, data) => {
      res.send("ok")
    })
  })
}
