'use strict'

const helper = require('../helper')

class MultiReporter {
constructor (reporters) {
this._reporters = reporters
}

addAdapter (adapter) {
this._reporters.forEach((reporter) => reporter.adapters.push(adapter))
}

