var EventEmitter = require('events').EventEmitter

var EmitterWrapper = require('../../lib/emitter_wrapper')

describe('emitter_wrapper', () => {
var emitter
var wrapped

beforeEach(() => {
emitter = new EventEmitter()
