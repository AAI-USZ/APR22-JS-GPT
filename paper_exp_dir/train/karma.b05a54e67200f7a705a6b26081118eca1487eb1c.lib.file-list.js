'use strict'

const Promise = require('bluebird')
const mm = require('minimatch')
const Glob = require('glob').Glob
const fs = Promise.promisifyAll(require('graceful-fs'))
const pathLib = require('path')
const _ = require('lodash')

const File = require('./file')
const Url = require('./url')
const helper = require('./helper')
const log = require('./logger').create('watcher')
const createPatternObject = require('./config').createPatternObject

class FileList {
constructor (patterns, excludes, emitter, preprocess, autoWatchBatchDelay) {
this._patterns = patterns || []
this._excludes = excludes || []
this._emitter = emitter
this._preprocess = Promise.promisify(preprocess)

this.buckets = new Map()


this._refreshing = null
