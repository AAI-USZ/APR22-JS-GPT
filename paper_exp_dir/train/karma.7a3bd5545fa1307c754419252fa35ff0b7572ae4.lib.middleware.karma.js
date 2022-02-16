

const url = require('url')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost
const common = require('./common')

const VERSION = require('../constants').VERSION
const SCRIPT_TYPE = {
js: 'text/javascript',
module: 'module'
}
const FILE_TYPES = [
'css',
'html',
'js',
'module',
'dom'
]

