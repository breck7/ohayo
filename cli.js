#! /usr/bin/env node --use_strict

const fs = require("fs")

const action = process.argv[2]
const paramOne = process.argv[3]
const paramTwo = process.argv[4]

require("./server.js")
