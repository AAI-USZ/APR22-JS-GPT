
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
utils = require('express/utils'),
kiwi = require('kiwi')

configure(function(){
var fiveMinutes = 300000,
oneMinute = 60000
kiwi.seed('haml')
kiwi.seed('sass')
use(MethodOverride)
