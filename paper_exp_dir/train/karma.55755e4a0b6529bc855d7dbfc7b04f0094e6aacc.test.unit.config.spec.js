var loadFile = require('mocks').loadFile
import path from 'path'
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


