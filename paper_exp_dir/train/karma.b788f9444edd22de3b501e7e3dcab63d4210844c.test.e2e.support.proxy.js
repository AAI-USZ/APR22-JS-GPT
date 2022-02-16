const http = require('http')
const httpProxy = require('http-proxy')
const { promisify } = require('util')

module.exports = class Proxy {
constructor () {
this.running = false
this.proxyPathRegExp = null

this.proxy = httpProxy.createProxyServer({
target: 'http://localhost:9876'
})
