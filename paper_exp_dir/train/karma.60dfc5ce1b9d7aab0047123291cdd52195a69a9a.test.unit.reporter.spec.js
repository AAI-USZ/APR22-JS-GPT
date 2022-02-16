'use strict'

var EventEmitter = require('events').EventEmitter
var loadFile = require('mocks').loadFile
var path = require('path')
var _ = require('lodash')
var sinon = require('sinon')

var File = require('../../lib/file')

describe('reporter', () => {
