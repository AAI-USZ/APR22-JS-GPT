'use strict'

const path = require('path')
const loadFile = require('mocks').loadFile
const helper = require('../../lib/helper')
const logger = require('../../lib/logger.js')

describe('config', () => {
let m
let e
let mocks

const resolveWinPath = (p) => helper.normalizeWinPath(path.resolve(p))

const normalizeConfigWithDefaults = (cfg) => {
if (!cfg.urlRoot) cfg.urlRoot = ''
if (!cfg.proxyPath) cfg.proxyPath = ''
if (!cfg.files) cfg.files = []
if (!cfg.exclude) cfg.exclude = []
if (!cfg.junitReporter) cfg.junitReporter = {}
if (!cfg.coverageReporter) cfg.coverageReporter = {}
if (!cfg.plugins) cfg.plugins = []

return m.normalizeConfig(cfg)
}


const patternsFrom = (list) => list.map((pattern) => pattern.pattern)

const wrapCfg = function (cfg) {
return (config) => config.set(cfg)
}

beforeEach(() => {
mocks = {}
mocks.process = { exit: sinon.spy() }
const mockConfigs = {
'/home/config1.js': wrapCfg({ basePath: 'base', reporters: ['dots'] }),
'/home/config2.js': wrapCfg({ basePath: '/abs/base' }),
'/home/config3.js': wrapCfg({ files: ['one.js', 'sub/two.js'] }),
'/home/config4.js': wrapCfg({ port: 123, autoWatch: true, basePath: '/abs/base' }),
'/home/config6.js': wrapCfg({ reporters: 'junit' }),
'/home/config7.js': wrapCfg({ browsers: ['Chrome', 'Firefox'] }),
'/home/config8.js': (config) => config.set({ files: config.suite === 'e2e' ? ['tests/e2e.spec.js'] : ['tests/unit.spec.js'] }),
'/home/config9.js': wrapCfg({ client: { useIframe: false } }),
'/conf/invalid.js': () => {
throw new SyntaxError('Unexpected token =')
},
'/conf/export-not-function.js': 'not-a-function',

'/conf/exclude.js': wrapCfg({ exclude: ['one.js', 'sub/two.js'] }),
'/conf/absolute.js': wrapCfg({ files: ['http://some.com', 'https://more.org/file.js'] }),
'/conf/both.js': wrapCfg({ files: ['one.js', 'two.js'], exclude: ['third.js'] }),
'/conf/coffee.coffee': wrapCfg({ files: ['one.js', 'two.js'] }),
'/conf/default-export.js': { default: wrapCfg({ files: ['one.js', 'two.js'] }) }
}


