import path from 'path'
var loadFile = require('mocks').loadFile
var helper = require('../../lib/helper')
var logger = require('../../lib/logger.js')

describe('config', () => {
var m
var e
var mocks

var resolveWinPath = (p) => helper.normalizeWinPath(path.resolve(p))

var normalizeConfigWithDefaults = (cfg) => {
if (!cfg.urlRoot) cfg.urlRoot = ''
if (!cfg.proxyPath) cfg.proxyPath = ''
if (!cfg.files) cfg.files = []
if (!cfg.exclude) cfg.exclude = []
if (!cfg.junitReporter) cfg.junitReporter = {}
if (!cfg.coverageReporter) cfg.coverageReporter = {}
if (!cfg.plugins) cfg.plugins = []

return m.normalizeConfig(cfg)
}


var patternsFrom = (list) => list.map((pattern) => pattern.pattern)

var wrapCfg = function (cfg) {
return (config) => config.set(cfg)
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
'/home/config8.js': (config) => config.set({ files: config.suite === 'e2e' ? ['tests/e2e.spec.js'] : ['tests/unit.spec.js'] }),
'/home/config9.js': wrapCfg({client: {useIframe: false}}),
'/conf/invalid.js': () => { throw new SyntaxError('Unexpected token =') },
'/conf/exclude.js': wrapCfg({exclude: ['one.js', 'sub/two.js']}),
'/conf/absolute.js': wrapCfg({files: ['http://some.com', 'https://more.org/file.js']}),
'/conf/both.js': wrapCfg({files: ['one.js', 'two.js'], exclude: ['third.js']}),
'/conf/coffee.coffee': wrapCfg({files: ['one.js', 'two.js']}),
'/conf/default-export.js': {default: wrapCfg({files: ['one.js', 'two.js']})}
}


m = loadFile(path.join(__dirname, '/../../lib/config.js'), mocks, {
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
logSpy = sinon.spy(logger.create('config'), 'error')
})

it('should resolve relative basePath to config directory', () => {
var config = e.parseConfig('/home/config1.js', {})
expect(config.basePath).to.equal(resolveWinPath('/home/base'))
})

it('should keep absolute basePath', () => {
var config = e.parseConfig('/home/config2.js', {})
