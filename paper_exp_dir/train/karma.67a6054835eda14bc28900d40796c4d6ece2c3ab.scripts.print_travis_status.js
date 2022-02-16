#!/usr/bin/env node
'use strict'

var http = require('https')

var COLORS = {
green: ['\x1B[32m', '\x1B[39m'],
red: ['\x1B[31m', '\x1B[39m']
}

var repo = process.argv[2]
var branches = process.argv[3]

if (!branches) {
console.log('No pending branches.')
process.exit(0)
}

branches = branches.split('\n')
