
'use strict'

const mime = require('mime')
const _ = require('lodash')
const parseRange = require('range-parser')
const Buffer = require('safe-buffer').Buffer

const log = require('../logger').create('web-server')

class PromiseContainer {
