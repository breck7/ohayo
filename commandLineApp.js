#! /usr/bin/env node --use_strict

const pack = require("../package.json")
const { jtree } = require("jtree")

class OhayoCommandLineApp {
  constructor() {}

  help() {
    const help = `command paramOne paramTwo description
help   Show this help
start port=1111  Start an Ohayo server on this port in the current directory
version   Show version number`
    return jtree.TreeNode.fromSsv(help).toTable()
  }

  start(port = 1111) {
    const { OhayoServerApp } = require("../OhayoServerApp.js")
    return new OhayoServerApp(port).start()
  }

  version() {
    return `ohayo version ${pack.version} installed at ${__filename}`
  }
}

module.exports = OhayoCommandLineApp

if (!module.parent) {
  const app = new OhayoCommandLineApp()

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
