




var utils = require('express/utils')



var MockRequest = Class({



httpVersion: '1.1',



init: function(method, path, options) {
this.method = method
this.url = path
this.connection = {
