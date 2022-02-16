

const path = require('path')
const url = require('url')
const helper = require('../helper')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost
const common = require('./common')

const VERSION = require('../constants').VERSION
const SCRIPT_TYPE = {
'js': 'text/javascript',
'dart': 'application/dart',
'module': 'module'
}
const FILE_TYPES = [
'css',
'html',
'js',
'dart',
'module',
'dom'
]

function filePathToUrlPath (filePath, basePath, urlRoot, proxyPath) {
if (filePath.startsWith(basePath)) {
return proxyPath + urlRoot.substr(1) + 'base' + filePath.substr(basePath.length)
}
return proxyPath + urlRoot.substr(1) + 'absolute' + filePath
}
