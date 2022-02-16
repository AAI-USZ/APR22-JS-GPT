
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
utils = require('express/utils'),
kiwi = require('kiwi')

configure(function(){
