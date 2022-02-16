'use strict'

describe('BrowserCollection', () => {
let emitter
const e = require('../../lib/events')
const Collection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')
let collection = emitter = null

beforeEach(() => {
