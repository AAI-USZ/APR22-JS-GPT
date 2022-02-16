




var StaticFile = require('express/static').File,
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
url = require('url')



InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})



