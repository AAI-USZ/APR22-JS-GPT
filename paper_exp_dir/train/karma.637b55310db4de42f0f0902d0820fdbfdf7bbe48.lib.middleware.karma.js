

const path = require('path')
const url = require('url')
const _ = require('lodash')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost

function urlparse (urlStr) {
const urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
