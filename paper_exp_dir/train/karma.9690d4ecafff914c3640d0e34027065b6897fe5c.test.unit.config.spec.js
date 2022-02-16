var loadFile = require('mocks').loadFile
import path from 'path'
var helper = require('../../lib/helper')
var logger = require('../../lib/logger.js')

describe('config', () => {
var m
var e
var mocks

var resolveWinPath = p => helper.normalizeWinPath(path.resolve(p))

var normalizeConfigWithDefaults = cfg => {
if (!cfg.urlRoot) cfg.urlRoot = ''
if (!cfg.files) cfg.files = []
if (!cfg.exclude) cfg.exclude = []
if (!cfg.junitReporter) cfg.junitReporter = {}
if (!cfg.coverageReporter) cfg.coverageReporter = {}
if (!cfg.plugins) cfg.plugins = []

return m.normalizeConfig(cfg)
}


var patternsFrom = list => list.map(pattern => pattern.pattern)

var wrapCfg = function (cfg) {
return config => config.set(cfg)
}

beforeEach(() => {
mocks = {}
mocks.process = {exit: sinon.spy()}
var mockConfigs = {
'/home/config1.js': wrapCfg({basePath: 'base', reporters: ['dots']}),
'/home/config2.js': wrapCfg({basePath: '/abs/base'}),
'/home/config3.js': wrapCfg({files: ['one.js', 'sub/two.js']}),
'/home/config4.js': wrapCfg({port: 123, autoWatch: true, basePath: '/abs/base'}),
'/home/config6.js': wrapCfg({reporters: 'junit'}),
'/home/config7.js': wrapCfg({browsers: ['Chrome', 'Firefox']}),
'/conf/invalid.js': () => { throw new SyntaxError('Unexpected token =') },
'/conf/exclude.js': wrapCfg({exclude: ['one.js', 'sub/two.js']}),
'/conf/absolute.js': wrapCfg({files: ['http://some.com', 'https://more.org/file.js']}),
'/conf/both.js': wrapCfg({files: ['one.js', 'two.js'], exclude: ['third.js']}),
'/conf/coffee.coffee': wrapCfg({files: ['one.js', 'two.js']})
}


m = loadFile(__dirname + '/../../lib/config.js', mocks, {
global: {},
process: mocks.process,
require (path) {
if (mockConfigs[path]) {
return mockConfigs[path]
}
if (path.indexOf('./') === 0) {
return require('../../lib/' + path)
} else {
return require(path)
}
}
})
e = m.exports
})

describe('parseConfig', () => {
var logSpy

beforeEach(() => {
logSpy = sinon.spy()
logger.create('config').on('log', logSpy)
})

it('should resolve relative basePath to config directory', () => {
var config = e.parseConfig('/home/config1.js', {})
expect(config.basePath).to.equal(resolveWinPath('/home/base'))
})

it('should keep absolute basePath', () => {
var config = e.parseConfig('/home/config2.js', {})
expect(config.basePath).to.equal(resolveWinPath('/abs/base'))
})

it('should resolve all file patterns', () => {
var config = e.parseConfig('/home/config3.js', {})
var actual = [resolveWinPath('/home/one.js'), resolveWinPath('/home/sub/two.js')]
expect(patternsFrom(config.files)).to.deep.equal(actual)
})

it('should keep absolute url file patterns', () => {
var config = e.parseConfig('/conf/absolute.js', {})
expect(patternsFrom(config.files)).to.deep.equal([
'http://some.com',
'https://more.org/file.js'
])
})

it('should resolve all exclude patterns', () => {
var config = e.parseConfig('/conf/exclude.js', {})
var actual = [
resolveWinPath('/conf/one.js'),
resolveWinPath('/conf/sub/two.js'),
resolveWinPath('/conf/exclude.js')
]

expect(config.exclude).to.deep.equal(actual)
})

it('should log error and exit if file does not exist', () => {
e.parseConfig('/conf/not-exist.js', {})

expect(logSpy).to.have.been.called
var event = logSpy.lastCall.args[0]
expect(event.level.toString()).to.be.equal('ERROR')
expect(event.data).to.be.deep.equal(['File %s does not exist!', '/conf/not-exist.js'])
expect(mocks.process.exit).to.have.been.calledWith(1)
})

it('should throw and log error if invalid file', () => {
e.parseConfig('/conf/invalid.js', {})

expect(logSpy).to.have.been.called
var event = logSpy.lastCall.args[0]
expect(event.level.toString()).to.be.equal('ERROR')
expect(event.data).to.be.deep.equal([
'Error in config file!\n',
new SyntaxError('Unexpected token =')
])
expect(mocks.process.exit).to.have.been.calledWith(1)
})

it('should override config with given cli options', () => {
var config = e.parseConfig('/home/config4.js', {port: 456, autoWatch: false})

expect(config.port).to.equal(456)
expect(config.autoWatch).to.equal(false)
expect(config.basePath).to.equal(resolveWinPath('/abs/base'))
})

it('should override config with cli options, but not deep merge', () => {

var config = e.parseConfig('/home/config7.js', {browsers: ['Safari']})

expect(config.browsers).to.deep.equal(['Safari'])
})

it('should resolve files and excludes to overriden basePath from cli', () => {
var config = e.parseConfig('/conf/both.js', {port: 456, autoWatch: false, basePath: '/xxx'})

expect(config.basePath).to.equal(resolveWinPath('/xxx'))
var actual = [resolveWinPath('/xxx/one.js'), resolveWinPath('/xxx/two.js')]
expect(patternsFrom(config.files)).to.deep.equal(actual)
expect(config.exclude).to.deep.equal([
resolveWinPath('/xxx/third.js'),
resolveWinPath('/conf/both.js')
])
})

it('should normalize urlRoot config', () => {
var config = normalizeConfigWithDefaults({urlRoot: ''})
expect(config.urlRoot).to.equal('/')

config = normalizeConfigWithDefaults({urlRoot: '/a/b'})
expect(config.urlRoot).to.equal('/a/b/')

config = normalizeConfigWithDefaults({urlRoot: 'a/'})
expect(config.urlRoot).to.equal('/a/')

config = normalizeConfigWithDefaults({urlRoot: 'some/thing'})
expect(config.urlRoot).to.equal('/some/thing/')
})

it('should change autoWatch to false if singleRun', () => {

var config = m.parseConfig('/home/config4.js', {singleRun: true})
expect(config.autoWatch).to.equal(false)
})

it('should normalize reporters to an array', () => {
var config = m.parseConfig('/home/config6.js', {})
expect(config.reporters).to.deep.equal(['junit'])
})

it('should compile coffeescript config', () => {
var config = e.parseConfig('/conf/coffee.coffee', {})
expect(patternsFrom(config.files)).to.deep.equal([
resolveWinPath('/conf/one.js'),
resolveWinPath('/conf/two.js')
])
})

it('should set defaults with coffeescript', () => {
var config = e.parseConfig('/conf/coffee.coffee', {})
expect(config.autoWatch).to.equal(true)
})

it('should not read config file, when null', () => {
var config = e.parseConfig(null, {basePath: '/some'})

expect(logSpy).not.to.have.been.called
expect(config.basePath).to.equal(resolveWinPath('/some'))
expect(config.urlRoot).to.equal('/')
})

it('should not read config file, when null but still resolve cli basePath', () => {
var config = e.parseConfig(null, {basePath: './some'})

expect(logSpy).not.to.have.been.called
expect(config.basePath).to.equal(resolveWinPath('./some'))
expect(config.urlRoot).to.equal('/')
})

it('should default unset options in client config', () => {
var config = e.parseConfig(null, {client: {args: ['--test']}})

expect(config.client.useIframe).to.not.be.undefined
expect(config.client.captureConsole).to.not.be.undefined

config = e.parseConfig(null, {client: {useIframe: true}})

expect(config.client.args).to.not.be.undefined
expect(config.client.captureConsole).to.not.be.undefined

config = e.parseConfig(null, {client: {captureConsole: true}})

expect(config.client.useIframe).to.not.be.undefined
expect(config.client.args).to.not.be.undefined
})

it('should validate and format the protocol', () => {
var config = normalizeConfigWithDefaults({})
expect(config.protocol).to.equal('http:')

config = normalizeConfigWithDefaults({ protocol: 'http' })
expect(config.protocol).to.equal('http:')

config = normalizeConfigWithDefaults({ protocol: 'http:' })
expect(config.protocol).to.equal('http:')
