'use strict'

describe('Browser', () => {
let collection
let emitter
let socket
const e = require('../../lib/events')
const Browser = require('../../lib/browser')
const Collection = require('../../lib/browser_collection')
const createMockTimer = require('./mocks/timer')
