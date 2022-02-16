'use strict'

const path = require('path')
const optimist = require('optimist')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')

function processArgs (argv, options, fs, path) {
if (argv.help) {
console.log(optimist.help())
process.exit(0)
}

if (argv.version) {
console.log('Karma version: ' + constant.VERSION)
process.exit(0)
}


Object.getOwnPropertyNames(argv).forEach(function (name) {
let argumentValue = argv[name]
if (name !== '_' && name !== '$0') {
if (name.indexOf('_') !== -1) {
throw new Error('Bad argument: ' + name + ' did you mean ' + name.replace('_', '-'))
}
if (Array.isArray(argumentValue)) {

argumentValue = argumentValue.pop()
}
options[helper.dashToCamel(name)] = argumentValue
}
})

if (helper.isString(options.autoWatch)) {
options.autoWatch = options.autoWatch === 'true'
}

if (helper.isString(options.colors)) {
options.colors = options.colors === 'true'
}

if (helper.isString(options.failOnEmptyTestSuite)) {
options.failOnEmptyTestSuite = options.failOnEmptyTestSuite === 'true'
}

if (helper.isString(options.failOnFailingTestSuite)) {
options.failOnFailingTestSuite = options.failOnFailingTestSuite === 'true'
}

if (helper.isString(options.formatError)) {
let required
try {
required = require(options.formatError)
} catch (err) {
console.error('Could not require formatError: ' + options.formatError, err)
