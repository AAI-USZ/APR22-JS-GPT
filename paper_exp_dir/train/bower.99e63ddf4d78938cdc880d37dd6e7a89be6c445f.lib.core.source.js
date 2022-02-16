







var request  = require('request');
var _        = require('underscore');

var endpoint = 'https://bower.herokuapp.com/packages';

if (process.env.HTTP_PROXY) {
request = request.defaults({'proxy': process.env.HTTP_PROXY});
}

exports.lookup = function (name, callback) {
request.get(endpoint + '/' + encodeURIComponent(name), function (err, response, body) {
if (err || response.statusCode !== 200) return callback(err || new Error(name + ' not found'));
callback(err, body && JSON.parse(body).url);
});
};
