#! /usr/bin/env node

const ThemeTreeComponent = require("./ThemeTreeComponent.js")
const { jtree } = require("jtree")
const testTree = {}

testTree.all = equal => {
  equal(!!ThemeTreeComponent.Themes, true, "Loads okay")
}

/*NODE_JS_ONLY*/ if (!module.parent) jtree.TestRacer.testSingleFile(__filename, testTree)
module.exports = { testTree }
