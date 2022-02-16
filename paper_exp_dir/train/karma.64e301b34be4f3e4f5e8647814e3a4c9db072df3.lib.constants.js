var fs = require('graceful-fs')
var path = require('path')

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json')).toString())

exports.VERSION = pkg.version

exports.DEFAULT_PORT = process.env.PORT || 9876
exports.DEFAULT_HOSTNAME = process.env.IP || 'localhost'


exports.LOG_DISABLE = 'OFF'
