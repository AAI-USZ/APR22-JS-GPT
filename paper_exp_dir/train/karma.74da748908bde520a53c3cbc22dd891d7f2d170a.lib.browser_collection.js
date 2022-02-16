'use strict'

const Result = require('./browser_result')

class BrowserCollection {
constructor (emitter, browsers) {
this.browsers = browsers || []
this.emitter = emitter
}

add (browser) {
this.browsers.push(browser)
this.emitter.emit('browsers_change', this)
}

remove (browser) {
const index = this.browsers.indexOf(browser)

if (index === -1) {
return false
}

this.browsers.splice(index, 1)
this.emitter.emit('browsers_change', this)

return true
}

getById (browserId) {
return this.browsers.find((browser) => browser.id === browserId) || null
}

areAllReady (nonReadyList) {
nonReadyList = nonReadyList || []

this.browsers.forEach((browser) => {
if (!browser.isConnected()) {
nonReadyList.push(browser)
}
})

return nonReadyList.length === 0
}

serialize () {
return this.browsers.map((browser) => browser.serialize())
}

calculateExitCode (results, singleRunBrowserNotCaptured, failOnEmptyTestSuite, failOnFailingTestSuite) {
if (results.disconnected || singleRunBrowserNotCaptured) {
return 1
}
if (results.success + results.failed === 0 && !failOnEmptyTestSuite) {
return 0
}
if (results.error) {
return 1
}
