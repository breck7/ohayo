#! /usr/bin/env node

// Todo: create new directory in ignore. Install ohayo. Start server. Ping server. Cleanup.

const testTree = {}
const { jtree } = require("jtree")

testTree.all = equal => {}

/*NODE_JS_ONLY*/ if (!module.parent) jtree.TestRacer.testSingleFile(__filename, testTree)
module.exports = { testTree }
