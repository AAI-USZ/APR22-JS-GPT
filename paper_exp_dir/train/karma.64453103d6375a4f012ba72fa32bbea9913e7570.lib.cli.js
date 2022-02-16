var path = require('path')
var optimist = require('optimist')
var fs = require('graceful-fs')

var Server = require('./server')
var helper = require('./helper')
var constant = require('./constants')

var processArgs = function (argv, options, fs, path) {
if (argv.help) {
console.log(optimist.help())
process.exit(0)
}

if (argv.version) {
console.log('Karma version: ' + constant.VERSION)
process.exit(0)
}


Object.getOwnPropertyNames(argv).forEach(function (name) {
var argumentValue = argv[name]
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

if (helper.isString(options.logLevel)) {
var logConstant = constant['LOG_' + options.logLevel.toUpperCase()]
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

var configFile = argv._.shift()

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
