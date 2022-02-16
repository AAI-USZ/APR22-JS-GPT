




var utils = require('express/utils')



var Session = Class({



init: function(sid) {
this.id = sid
this.touch()
},



touch: function() {
