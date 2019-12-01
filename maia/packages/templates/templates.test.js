#! /usr/bin/env node

const { jtree } = require("jtree")

const Templates = jtree.TreeNode.fromDisk(__dirname + "/Templates.stamp")
const gopherNode = require("../../../testing/gopher.nodejs.js")

const testTree = {}

const code = Templates.map(file => {
  if (!file.getWord(1))
    // todo: get rid of end of file newline
    return []
  const filename = file.getWord(1).replace("templates/", "")
  const code = new jtree.TreeNode(`testProgram ${filename} 0`)
  code.nodeAt(0).setChildren(file.getNode("data").childrenToString())
  return code.toString()
}).join("\n")

testTree.runAllTemplates = async () => {
  // TODO: reenable!
  return 1
  new gopherNode(code.toString()).execute()
}

/*NODE_JS_ONLY*/ if (!module.parent) jtree.TestRacer.testSingleFile(__filename, testTree)
module.exports = { testTree }
