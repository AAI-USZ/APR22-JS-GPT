'use strict'

const fs = require('graceful-fs')
const path = require('path')
const _ = require('lodash')
const useragent = require('useragent')
const mm = require('minimatch')

exports.browserFullNameToShort = (fullName) => {
const agent = useragent.parse(fullName)
const isUnknown = agent.family === 'Other' || agent.os.family === 'Other'
return isUnknown ? fullName : `${agent.toAgent()} (${agent.os})`
}

exports.isDefined = (value) => {
return !_.isUndefined(value)
