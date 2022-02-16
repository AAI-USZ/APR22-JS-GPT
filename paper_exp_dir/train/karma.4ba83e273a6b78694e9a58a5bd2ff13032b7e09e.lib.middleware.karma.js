

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
