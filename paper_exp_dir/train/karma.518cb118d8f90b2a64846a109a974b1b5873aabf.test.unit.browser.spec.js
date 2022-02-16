'use strict'

describe('Browser', () => {
let collection
let emitter
let socket
const e = require('../../lib/events')
const Browser = require('../../lib/browser')
const Collection = require('../../lib/browser_collection')
const createMockTimer = require('./mocks/timer')

let browser = collection = emitter = socket = null
let socketId = 0

const mkSocket = () => {
const s = new e.EventEmitter()
socketId = socketId + 1
s.id = socketId
return s
}

beforeEach(() => {
socket = mkSocket()
emitter = new e.EventEmitter()
collection = new Collection(emitter)
})

it('should set fullName and name', () => {
const fullName = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 ' + '(KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
browser = new Browser('id', fullName, collection, emitter, socket)
expect(browser.name).to.equal('Chrome 16.0.912 (Mac OS X 10.6.8)')
expect(browser.fullName).to.equal(fullName)
})

it('should serialize to JSON', () => {
const fullName = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 ' + '(KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
browser = new Browser('id', fullName, collection, emitter, socket)
emitter.browser = browser
const json = JSON.stringify(browser)
expect(json).to.contain(fullName)
})

describe('init', () => {
it('should emit "browser_register"', () => {
