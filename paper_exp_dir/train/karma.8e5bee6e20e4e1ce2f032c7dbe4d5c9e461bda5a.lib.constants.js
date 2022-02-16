var fs = require('graceful-fs')
var path = require('path')

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json')).toString())

exports.VERSION = pkg.version

exports.DEFAULT_PORT = process.env.PORT || 9876
exports.DEFAULT_HOSTNAME = process.env.IP || 'localhost'
exports.DEFAULT_LISTEN_ADDR = process.env.LISTEN_ADDR || '0.0.0.0'


exports.LOG_DISABLE = 'OFF'
exports.LOG_ERROR = 'ERROR'
exports.LOG_WARN = 'WARN'
exports.LOG_INFO = 'INFO'
exports.LOG_DEBUG = 'DEBUG'


exports.COLOR_PATTERN = '%[%d{DATE}:%p [%c]: %]%m'
exports.NO_COLOR_PATTERN = '%d{DATE}:%p [%c]: %m'
