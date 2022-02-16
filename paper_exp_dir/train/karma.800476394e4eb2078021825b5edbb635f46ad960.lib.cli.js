var path = require('path')
var optimist = require('optimist')
var fs = require('fs')

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
