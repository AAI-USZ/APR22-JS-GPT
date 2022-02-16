




var utils = require('express/utils'),
Cookie = require('express/plugins/cookie').Cookie



var Session = Class({



init: function(sid) {
this.id = sid
this.touch()
},



