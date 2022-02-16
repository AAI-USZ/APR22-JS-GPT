'use strict'

const chokidar = require('chokidar')
const mm = require('minimatch')
const expandBraces = require('expand-braces')

const helper = require('./helper')
const log = require('./logger').create('watcher')

const DIR_SEP = require('path').sep

function baseDirFromPattern (pattern) {
return pattern
.replace(/[/\\][^/\\]*\*.*$/, '')
.replace(/[/\\][^/\\]*[!+]\(.*$/, '')
.replace(/[/\\][^/\\]*\)\?.*$/, '') || DIR_SEP
}

function watchPatterns (patterns, watcher) {
let pathsToWatch = new Set()


expandBraces(patterns)
.forEach((path) => pathsToWatch.add(baseDirFromPattern(path)))

pathsToWatch = Array.from(pathsToWatch)

pathsToWatch.forEach((path) => {
if (!pathsToWatch.some((p) => p !== path && path.startsWith(p + DIR_SEP))) {
watcher.add(path)
log.debug('Watching "%s"', path)
}
})
}

function checkAnyPathMatch (patterns, path) {
return patterns.some((pattern) => mm(path, pattern, {dot: true}))
}

function createIgnore (patterns, excludes) {
return function (path, stat) {
if (stat && !stat.isDirectory()) {
return !checkAnyPathMatch(patterns, path) || checkAnyPathMatch(excludes, path)
} else {
return false
}
}
}

function getWatchedPatterns (patterns) {
return patterns
.filter((pattern) => pattern.watched)
.map((pattern) => pattern.pattern)
}

