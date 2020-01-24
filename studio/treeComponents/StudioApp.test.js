#! /usr/bin/env node
const StudioApp = require("./StudioApp.js")
const { jtree } = require("jtree")

const testTree = {}

testTree.basics = equal => {
  equal(true, true)
}

/*NODE_JS_ONLY*/ if (!module.parent) jtree.TestRacer.testSingleFile(__filename, testTree)
module.exports = { testTree }
