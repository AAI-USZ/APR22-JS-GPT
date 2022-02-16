




var utils = require('express/utils'),
extname = require('path').extname,
fs = require('fs')



var engines = {}



exports.View = Plugin.extend({
extend: {



init: function() {



set('views', function(){ return set('root') + '/views' })



Request.include({
