

const path = require('path')
const util = require('util')
const url = require('url')
const _ = require('lodash')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost

function urlparse (urlStr) {
const urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
}

const common = require('./common')

const VERSION = require('../constants').VERSION
const SCRIPT_TAG = '<script type="%s" src="%s" %s></script>'
