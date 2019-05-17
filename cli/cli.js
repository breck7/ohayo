#! /usr/bin/env node --use_strict

const fs = require("fs")
const pack = require("../package.json")
const jtree = require("jtree")
const TreeNode = jtree.TreeNode

class CLI {
  constructor() {}

  help() {
    const help = this._read(__dirname + "/help.ssv")
    return TreeNode.fromSsv(help).toTable()
  }

  _read(path) {
    return fs.readFileSync(path, "utf8")
  }

  start(port = 1111) {
    const OhayoServerApp = require("../OhayoServerApp.js")
    return new OhayoServerApp(port).start()
  }

  version() {
    return `ohayo version ${pack.version} installed at ${__filename}`
  }
}

module.exports = CLI

if (!module.parent) {
  const app = new CLI()

  const action = process.argv[2]
  const paramOne = process.argv[3]
  const paramTwo = process.argv[4]
  const print = console.log

  if (app[action]) {
    const returnValue = app[action](paramOne, paramTwo)
    if (typeof returnValue === "string") print(returnValue)
  } else if (!action) {
    print(app.help())
  } else print(`Unknown command '${action}'. Type 'ohayo help' to see available commands.`)
}
