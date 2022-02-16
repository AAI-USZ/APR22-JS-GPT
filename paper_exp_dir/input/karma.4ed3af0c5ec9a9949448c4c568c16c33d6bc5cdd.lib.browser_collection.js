'use strict'

const BrowserResult = require('./browser_result')
const helper = require('./helper')

class BrowserCollection {
constructor (emitter, browsers = []) {
this.browsers = browsers
this.emitter = emitter
}

add (browser) {
this.browsers.push(browser)
this.emitter.emit('browsers_change', this)
}

remove (browser) {
if (helper.arrayRemove(this.browsers, browser)) {
this.emitter.emit('browsers_change', this)
return true
}
return false
}

getById (browserId) {
return this.browsers.find((browser) => browser.id === browserId) || null
}

getNonReady () {
return this.browsers.filter((browser) => !browser.isConnected())
}

areAllReady () {
return this.browsers.every((browser) => browser.isConnected())
}

serialize () {
return this.browsers.map((browser) => browser.serialize())
}

