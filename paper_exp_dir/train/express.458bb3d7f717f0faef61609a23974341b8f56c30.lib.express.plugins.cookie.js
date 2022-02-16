




var Request = require('express/request').Request
var QueryString = require('querystring')



exports.parseCookie = function(cookieStr) {
return cookieStr.split(/[;,] */n).reduce(function(cookies, p) {
var eqidx = p.indexOf('=')
if(eqidx == -1) return cookies
var k = QueryString.unescape(p.slice(0, eqidx).trim(), true)
var v = QueryString.unescape(p.slice(eqidx + 1).trim(), true)
var m = v.match(/^("|')(.*)\1$/)
if(m) v = m[2].replace('\\'+m[1], m[1])
