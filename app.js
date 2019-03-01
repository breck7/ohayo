#! /usr/local/bin/node

const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  "/",
  express.static(__dirname, {
    maxAge: 31557600000
  })
)

app.config = require("./server/config.js")

require("./server/shell.js")(app)
require("./server/dir.js")(app)
require("./server/serverStorage.js")(app)

module.exports = app

if (!module.parent) {
  const port = process.argv[2] || 1111

  app.listen(port, () => {
    console.log(`Running ohayo. cmd+dblclick: http://localhost:${port}/`)
  })
}
