'use strict'

const path = require('path')
const yargs = require('yargs')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')
const cfg = require('./config')

function processArgs (argv, options, fs, path) {
Object.getOwnPropertyNames(argv).forEach(function (name) {
let argumentValue = argv[name]
if (name !== '_' && name !== '$0') {
if (Array.isArray(argumentValue)) {
argumentValue = argumentValue.pop()
}
options[helper.dashToCamel(name)] = argumentValue
