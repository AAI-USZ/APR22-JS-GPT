'use strict'

const fs = require('graceful-fs')
const path = require('path')
const _ = require('lodash')
const useragent = require('ua-parser-js')
const mm = require('minimatch')

exports.browserFullNameToShort = (fullName) => {
const ua = useragent(fullName)
if (!ua.browser.name && !ua.browser.version && !ua.os.name && !ua.os.version) {
return fullName
}
return `${ua.browser.name} ${ua.browser.version || '0.0.0'} (${ua.os.name} ${ua.os.version || '0.0.0'})`
}

exports.isDefined = (value) => {
return !_.isUndefined(value)
}
