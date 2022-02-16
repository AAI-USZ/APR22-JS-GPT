describe('Browser', () => {
var collection
var emitter
var socket
var e = require('../../lib/events')
var Browser = require('../../lib/browser')
var Collection = require('../../lib/browser_collection')
var createMockTimer = require('./mocks/timer')

var browser = collection = emitter = socket = null
var socketId = 0

var mkSocket = () => {
var s = new e.EventEmitter()
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
var fullName = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 ' + '(KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
browser = new Browser('id', fullName, collection, emitter, socket)
expect(browser.name).to.equal('Chrome 16.0.912 (Mac OS X 10.6.8)')
expect(browser.fullName).to.equal(fullName)
})

describe('init', () => {
it('should emit "browser_register"', () => {
var spyRegister = sinon.spy()
emitter.on('browser_register', spyRegister)
browser = new Browser(12345, '', collection, emitter, socket)
browser.init()

expect(spyRegister).to.have.been.called
expect(spyRegister.args[0][0]).to.equal(browser)
})

it('should ad itself into the collection', () => {
browser = new Browser(12345, '', collection, emitter, socket)
browser.init()

expect(collection.length).to.equal(1)
collection.forEach((browserInCollection) => {
expect(browserInCollection).to.equal(browser)
})
})
})

describe('toString', () => {
it('should return browser name', () => {
var fullName = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 ' + '(KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
browser = new Browser('id', fullName, collection, emitter, socket)
expect(browser.toString()).to.equal('Chrome 16.0.912 (Mac OS X 10.6.8)')
})

it('should return verbatim user agent string for unrecognized browser', () => {
var fullName = 'NonexistentBot/1.2.3'
browser = new Browser('id', fullName, collection, emitter, socket)
expect(browser.toString()).to.equal('NonexistentBot/1.2.3')
})
})

describe('onKarmaError', () => {
beforeEach(() => {
browser = new Browser('fake-id', 'full name', collection, emitter, socket)
})

it('should set lastResult.error and fire "browser_error"', () => {
var spy = sinon.spy()
emitter.on('browser_error', spy)
browser.state = Browser.STATE_EXECUTING

browser.onKarmaError()
expect(browser.lastResult.error).to.equal(true)
expect(spy).to.have.been.called
})

it('should ignore if browser not executing', () => {
var spy = sinon.spy()
emitter.on('browser_error', spy)
browser.state = Browser.STATE_READY

browser.onKarmaError()
expect(browser.lastResult.error).to.equal(false)
expect(spy).not.to.have.been.called
})
})

describe('onInfo', () => {
beforeEach(() => {
browser = new Browser('fake-id', 'full name', collection, emitter, socket)
})

it('should emit "browser_log"', () => {
var spy = sinon.spy()
emitter.on('browser_log', spy)

browser.state = Browser.STATE_EXECUTING
browser.onInfo({log: 'something', type: 'info'})
expect(spy).to.have.been.calledWith(browser, 'something', 'info')
})

it('should emit "browser_info"', () => {
var spy = sinon.spy()
var infoData = {}
emitter.on('browser_info', spy)

browser.state = Browser.STATE_EXECUTING
browser.onInfo(infoData)
expect(spy).to.have.been.calledWith(browser, infoData)
})

it('should ignore if browser not executing', () => {
