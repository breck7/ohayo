#! /usr/bin/env node

const { jtree } = require("jtree")
const { Disk } = require("jtree/products/Disk.node.js")

const testTree = {}

testTree.all = equal => {
  // todo: it looks like I was doing some sort of speed test here. Fix this.
  const data = Disk.read("maia/maia.grammar")
  let maiaGrammar = new jtree.HandGrammarProgram(data)
}

/*NODE_JS_ONLY*/ if (!module.parent) jtree.TestRacer.testSingleFile(__filename, testTree)
module.exports = { testTree }
