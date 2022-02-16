'use strict'

const path = require('path')
const yargs = require('yargs')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')

function processArgs (argv, options, fs, path) {
Object.getOwnPropertyNames(argv).forEach(function (name) {
let argumentValue = argv[name]
if (name !== '_' && name !== '$0') {
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
}

options.formatError = required.formatError || required
if (!helper.isFunction(options.formatError)) {
console.error(`Format error must be a function, got: ${typeof options.formatError}`)
process.exit(1)
}
}

if (helper.isString(options.logLevel)) {
const logConstant = constant['LOG_' + options.logLevel.toUpperCase()]
if (helper.isDefined(logConstant)) {
options.logLevel = logConstant
} else {
console.error('Log level must be one of disable, error, warn, info, or debug.')
process.exit(1)
}
} else if (helper.isDefined(options.logLevel)) {
console.error('Log level must be one of disable, error, warn, info, or debug.')
process.exit(1)
}

if (helper.isString(options.singleRun)) {
options.singleRun = options.singleRun === 'true'
}

if (helper.isString(options.browsers)) {
options.browsers = options.browsers.split(',')
}

if (options.reportSlowerThan === false) {
options.reportSlowerThan = 0
}

if (helper.isString(options.reporters)) {
options.reporters = options.reporters.split(',')
}

if (helper.isString(options.removedFiles)) {
options.removedFiles = options.removedFiles.split(',')
}

if (helper.isString(options.addedFiles)) {
options.addedFiles = options.addedFiles.split(',')
}

if (helper.isString(options.changedFiles)) {
options.changedFiles = options.changedFiles.split(',')
}

if (helper.isString(options.refresh)) {
options.refresh = options.refresh === 'true'
}

let configFile = argv.configFile

if (!configFile) {

if (fs.existsSync('./karma.conf.js')) {
configFile = './karma.conf.js'
} else if (fs.existsSync('./karma.conf.coffee')) {
configFile = './karma.conf.coffee'
} else if (fs.existsSync('./karma.conf.ts')) {
configFile = './karma.conf.ts'
} else if (fs.existsSync('./.config/karma.conf.js')) {
configFile = './.config/karma.conf.js'
} else if (fs.existsSync('./.config/karma.conf.coffee')) {
configFile = './.config/karma.conf.coffee'
} else if (fs.existsSync('./.config/karma.conf.ts')) {
configFile = './.config/karma.conf.ts'
}
}

options.configFile = configFile ? path.resolve(configFile) : null

if (options.cmd === 'run') {
options.clientArgs = parseClientArgs(process.argv)
}

return options
}

function parseClientArgs (argv) {

let clientArgs = []
argv = argv.slice(2)
const idx = argv.indexOf('--')
if (idx !== -1) {
clientArgs = argv.slice(idx + 1)
}
return clientArgs
}


function argsBeforeDoubleDash (argv) {
const idx = argv.indexOf('--')

return idx === -1 ? argv : argv.slice(0, idx)
}

function describeRoot () {
return yargs
.usage('Karma - Spectacular Test Runner for JavaScript.\n\n' +
'Run --help with particular command to see its description and available options.\n\n' +
'Usage:\n' +
'  $0 <command>')
.command('init [configFile]', 'Initialize a config file.', describeInit)
.command('start [configFile]', 'Start the server / do a single run.', describeStart)
.command('run [configFile]', 'Trigger a test run.', describeRun)
.command('stop [configFile]', 'Stop the server.', describeStop)
.command('completion', 'Shell completion for karma.', describeCompletion)
.demandCommand(1, 'Command not specified.')
.strictCommands()
.describe('help', 'Print usage and options.')
.describe('version', 'Print current version.')
}

function describeInit (yargs) {
yargs
.usage('Karma - Spectacular Test Runner for JavaScript.\n\n' +
'INIT - Initialize a config file.\n\n' +
'Usage:\n' +
'  $0 init [configFile]')
.strictCommands(false)
.version(false)
.positional('configFile', {
describe: 'Name of the generated Karma configuration file',
type: 'string'
})
.describe('log-level', '<disable | error | warn | info | debug> Level of logging.')
.describe('colors', 'Use colors when reporting and printing logs.')
.describe('no-colors', 'Do not use colors when reporting or printing logs.')
