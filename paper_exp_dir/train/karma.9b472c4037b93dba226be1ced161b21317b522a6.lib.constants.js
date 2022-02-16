'use strict'

const fs = require('graceful-fs')
const path = require('path')

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json')).toString())

exports.VERSION = pkg.version

exports.DEFAULT_PORT = process.env.PORT || 9876
exports.DEFAULT_HOSTNAME = process.env.IP || 'localhost'
exports.DEFAULT_LISTEN_ADDR = process.env.LISTEN_ADDR || '0.0.0.0'
