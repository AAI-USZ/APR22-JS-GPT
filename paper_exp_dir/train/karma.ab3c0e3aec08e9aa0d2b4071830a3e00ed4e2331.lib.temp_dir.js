'use strict'

const path = require('path')
const fs = require('graceful-fs')
const rimraf = require('rimraf')
const log = require('./logger').create('temp-dir')

const TEMP_DIR = require('os').tmpdir()

module.exports = {
