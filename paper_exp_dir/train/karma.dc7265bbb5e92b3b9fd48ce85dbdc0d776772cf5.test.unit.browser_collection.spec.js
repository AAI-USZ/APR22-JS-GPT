'use strict'

describe('BrowserCollection', () => {
let emitter
const e = require('../../lib/events')
const Collection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')
let collection = emitter = null

beforeEach(() => {
emitter = new e.EventEmitter()
collection = new Collection(emitter)
})

describe('add', () => {
it('should add browser', () => {
expect(collection.length).to.equal(0)
collection.add(new Browser('id'))
expect(collection.length).to.equal(1)
})

it('should fire "browsers_change" event', () => {
const spy = sinon.spy()
emitter.on('browsers_change', spy)
collection.add({})
expect(spy).to.have.been.called
})
})

describe('remove', () => {
it('should remove given browser', () => {
const browser = new Browser('id')
collection.add(browser)

expect(collection.length).to.equal(1)
expect(collection.remove(browser)).to.equal(true)
expect(collection.length).to.equal(0)
})

it('should fire "browsers_change" event', () => {
const spy = sinon.spy()
const browser = new Browser('id')
collection.add(browser)

emitter.on('browsers_change', spy)
collection.remove(browser)
expect(spy).to.have.been.called
})

it('should return false if given browser does not exist within the collection', () => {
const spy = sinon.spy()
emitter.on('browsers_change', spy)
expect(collection.remove({})).to.equal(false)
expect(spy).not.to.have.been.called
})
})

describe('getById', () => {
it('should find the browser by id', () => {
const browser = new Browser(123)
collection.add(browser)

expect(collection.getById(123)).to.equal(browser)
})

it('should return null if no browser with given id', () => {
expect(collection.getById(123)).to.equal(null)

collection.add(new Browser(456))
expect(collection.getById(123)).to.equal(null)
})
})

describe('areAllReady', () => {
let browsers = null

beforeEach(() => {
browsers = [new Browser(), new Browser(), new Browser()]
browsers.forEach((browser) => {
browser.state = Browser.STATE_CONNECTED
collection.add(browser)
})
})

it('should return true if all browsers are ready', () => {
expect(collection.areAllReady()).to.equal(true)
})

it('should return false if at least one browser is not ready', () => {
