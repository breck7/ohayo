#! /usr/local/bin/node

const express = require("express")
const fs = require("fs")
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

require("./server/shell.js")(app)
require("./server/dir.js")(app)
require("./server/serverStorage.js")(app)

const port = 8007
app.listen(port, () => {
  console.log(`Running ohayo. cmd+dblclick: http://localhost:${port}/`)
})
