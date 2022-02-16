'use strict'

const EventEmitter = require('events').EventEmitter
const loadFile = require('mocks').loadFile
const path = require('path')
const _ = require('lodash')
const sinon = require('sinon')

const File = require('../../lib/file')

describe('reporter', () => {
let m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/reporter.js'))
})

describe('formatError', () => {
let emitter
let formatError = emitter = null
let sandbox
