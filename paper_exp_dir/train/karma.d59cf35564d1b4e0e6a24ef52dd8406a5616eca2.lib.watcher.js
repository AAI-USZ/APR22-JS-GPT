'use strict'

const mm = require('minimatch')
const expandBraces = require('expand-braces')
const PatternUtils = require('./utils/pattern-utils')

const helper = require('./helper')
const log = require('./logger').create('watcher')

const DIR_SEP = require('path').sep

function watchPatterns (patterns, watcher) {
