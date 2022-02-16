'use strict'

const chokidar = require('chokidar')
const mm = require('minimatch')
const expandBraces = require('expand-braces')
const PatternUtils = require('./utils/pattern-utils')

const helper = require('./helper')
const log = require('./logger').create('watcher')

const DIR_SEP = require('path').sep

function watchPatterns (patterns, watcher) {
expandBraces(patterns)
.map(PatternUtils.getBaseDir)
.filter((path, index, paths) => paths.indexOf(path) === index)
.forEach((path, index, paths) => {
if (!paths.some((p) => path.startsWith(p + DIR_SEP))) {
watcher.add(path)
log.debug(`Watching "${path}"`)
}
})
}
