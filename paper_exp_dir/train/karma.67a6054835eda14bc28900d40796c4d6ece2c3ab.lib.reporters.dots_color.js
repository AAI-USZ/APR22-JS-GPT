var DotsReporter = require('./dots')
var BaseColorReporter = require('./base_color')

var DotsColorReporter = function (formatError, reportSlow) {
DotsReporter.call(this, formatError, reportSlow)
BaseColorReporter.call(this)
}


module.exports = DotsColorReporter
