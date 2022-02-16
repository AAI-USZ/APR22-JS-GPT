import cli from '../../lib/cli'
import optimist from 'optimist'
import path from 'path'
import constant from '../../lib/constants'
import mocks from 'mocks'
var loadFile = mocks.loadFile

describe('cli', () => {
var m
var e
var mockery

var fsMock = mocks.fs.create({
cwd: {'karma.conf.js': true},
cwd2: {'karma.conf.coffee': true},
cwd3: {'karma.conf.ts': true}
})

var currentCwd = null

var pathMock = {
resolve (p) {
return path.resolve(currentCwd, p)
}
}

var setCWD = (cwd) => {
currentCwd = cwd
fsMock._setCWD(cwd)
}

var processArgs = (args, opts) => {
var argv = optimist.parse(args)
return e.processArgs(argv, opts || {}, fsMock, pathMock)
}

beforeEach(() => {
setCWD('/')
mockery = {}
mockery.process = {exit: sinon.spy()}
mockery.console = {error: sinon.spy()}


m = loadFile(path.join(__dirname, '/../../lib/cli.js'), mockery, {
global: {},
console: mockery.console,
process: mockery.process,
require (path) {
if (path.indexOf('./') === 0) {
return require('../../lib/' + path)
} else {
return require(path)
}
}
})
e = m.exports
})

describe('processArgs', () => {
it('should override if multiple options given', () => {

var options = processArgs(['some.conf', '--port', '12', '--log-level', 'info', '--port', '34', '--log-level', 'debug'])

expect(options.port).to.equal(34)
expect(options.logLevel).to.equal('DEBUG')
})

it('should return camelCased options', () => {
var options = processArgs(['some.conf', '--port', '12', '--single-run'])

expect(options.configFile).to.exist
expect(options.port).to.equal(12)
expect(options.singleRun).to.equal(true)
})

it('should parse options without configFile and set default', () => {
setCWD('/cwd')
var options = processArgs(['--auto-watch', '--auto-watch-interval', '10'])
expect(path.resolve(options.configFile)).to.equal(path.resolve('/cwd/karma.conf.js'))
expect(options.autoWatch).to.equal(true)
expect(options.autoWatchInterval).to.equal(10)
})

it('should set default karma.conf.coffee config file if exists', () => {
setCWD('/cwd2')
var options = processArgs(['--port', '10'])

expect(path.resolve(options.configFile)).to.equal(path.resolve('/cwd2/karma.conf.coffee'))
})

it('should set default karma.conf.ts config file if exists', () => {
setCWD('/cwd3')
var options = processArgs(['--port', '10'])

expect(path.resolve(options.configFile)).to.equal(path.resolve('/cwd3/karma.conf.ts'))
})

it('should not set default config if neither exists', () => {
setCWD('/')
var options = processArgs([])

expect(options.configFile).to.equal(null)
})

it('should parse auto-watch, colors, singleRun to boolean', () => {
var options = processArgs(['--auto-watch', 'false', '--colors', 'false', '--single-run', 'false'])

expect(options.autoWatch).to.equal(false)
expect(options.colors).to.equal(false)
expect(options.singleRun).to.equal(false)

options = processArgs(['--auto-watch', 'true', '--colors', 'true', '--single-run', 'true'])

expect(options.autoWatch).to.equal(true)
expect(options.colors).to.equal(true)
expect(options.singleRun).to.equal(true)
})

it('should replace log-level constants', () => {
var options = processArgs(['--log-level', 'debug'])
expect(options.logLevel).to.equal(constant.LOG_DEBUG)

options = processArgs(['--log-level', 'error'])
expect(options.logLevel).to.equal(constant.LOG_ERROR)

options = processArgs(['--log-level', 'warn'])
expect(options.logLevel).to.equal(constant.LOG_WARN)

options = processArgs(['--log-level', 'foo'])
expect(mockery.process.exit).to.have.been.calledWith(1)

options = processArgs(['--log-level'])
expect(mockery.process.exit).to.have.been.calledWith(1)
})

it('should parse format-error into a function', () => {

var options = processArgs(['--format-error', '../../test/unit/fixtures/format-error-root'])
var formatErrorRoot = require('../../test/unit/fixtures/format-error-root')
expect(options.formatError).to.equal(formatErrorRoot)


options = processArgs(['--format-error', '../../test/unit/fixtures/format-error-property'])
var formatErrorProperty = require('../../test/unit/fixtures/format-error-property').formatError
expect(options.formatError).to.equal(formatErrorProperty)
