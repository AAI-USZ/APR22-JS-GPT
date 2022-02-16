'use strict'

const chokidar = require('chokidar')
const mm = require('minimatch')
const expandBraces = require('expand-braces')

const helper = require('./helper')
const log = require('./logger').create('watcher')

const DIR_SEP = require('path').sep

