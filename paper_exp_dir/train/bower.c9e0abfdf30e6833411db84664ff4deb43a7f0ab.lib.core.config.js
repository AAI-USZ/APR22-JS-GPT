

module.exports = function() {

var c = require('rc') ('bower', {

directory: 'components',
json:      'component.json',
endpoint:  'https://bower.herokuapp.com',
searchpath: []
});



var fs = require('fs');
