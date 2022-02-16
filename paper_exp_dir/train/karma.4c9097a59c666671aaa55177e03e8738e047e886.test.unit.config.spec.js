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
const wrapAsyncCfg = function (cfg) {
return async (config) => config.set(cfg)
}

beforeEach(() => {
mocks = {}
mocks.process = { exit: sinon.spy() }
const mockConfigs = {
'/home/config1.js': wrapCfg({ basePath: 'base', reporters: ['dots'] }),
'/home/config2.js': wrapCfg({ basePath: '/abs/base' }),
