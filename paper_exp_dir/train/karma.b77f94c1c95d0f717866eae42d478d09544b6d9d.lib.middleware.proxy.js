const url = require('url')
const { Agent: httpAgent } = require('http')
const { Agent: httpsAgent } = require('https')
const httpProxy = require('http-proxy')
const _ = require('lodash')

const log = require('../logger').create('proxy')

function parseProxyConfig (proxies, config) {
proxies = proxies || []
return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
if (typeof proxyConfiguration === 'string') {
