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

function byPath (a, b) {
if (a.path > b.path) return 1
if (a.path < b.path) return -1

return 0
}

class FileList {
constructor (patterns, excludes, emitter, preprocess, autoWatchBatchDelay) {
this._patterns = patterns || []
this._excludes = excludes || []
this._emitter = emitter
this._preprocess = Promise.promisify(preprocess)

this.buckets = new Map()


this._refreshing = null

const emit = () => {
this._emitter.emit('file_list_modified', this.files)
}

const debouncedEmit = _.debounce(emit, autoWatchBatchDelay)
this._emitModified = (immediate) => {
immediate ? emit() : debouncedEmit()
