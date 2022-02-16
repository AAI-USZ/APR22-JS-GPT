'use strict'

const path = require('path')
const assert = require('assert')
const yargs = require('yargs')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')

function processArgs (argv, options, fs, path) {

Object.getOwnPropertyNames(argv).forEach(function (name) {
let argumentValue = argv[name]
if (name !== '_' && name !== '$0') {
assert(!name.includes('_'), `Bad argument: ${name} did you mean ${name.replace('_', '-')}`)

if (Array.isArray(argumentValue)) {
argumentValue = argumentValue.pop()
}
options[helper.dashToCamel(name)] = argumentValue
}
