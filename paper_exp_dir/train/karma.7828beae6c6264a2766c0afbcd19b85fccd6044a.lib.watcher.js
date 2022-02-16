'use strict'

const mm = require('minimatch')
const braces = require('braces')
const PatternUtils = require('./utils/pattern-utils')

const helper = require('./helper')
const log = require('./logger').create('watcher')

const DIR_SEP = require('path').sep

function watchPatterns (patterns, watcher) {
let expandedPatterns = []
patterns.map((pattern) => {

expandedPatterns = expandedPatterns.concat(braces.expand(pattern, { keepEscaping: true }))
})
expandedPatterns
.map(PatternUtils.getBaseDir)
.filter((path, index, paths) => paths.indexOf(path) === index)
.forEach((path, index, paths) => {
if (!paths.some((p) => path.startsWith(p + DIR_SEP))) {
watcher.add(path)
log.debug(`Watching "${path}"`)
