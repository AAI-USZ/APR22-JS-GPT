'use strict'

const EventEmitter = require('events').EventEmitter
const EmitterWrapper = require('../../lib/emitter_wrapper')

describe('emitter_wrapper', () => {
let emitter
let wrapped

beforeEach(() => {
emitter = new EventEmitter()
