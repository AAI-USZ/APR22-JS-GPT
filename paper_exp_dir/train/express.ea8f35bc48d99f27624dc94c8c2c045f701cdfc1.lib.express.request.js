




var StaticFile = require('express/static').File



var statusBodies = require('http').STATUS_CODES



InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})
