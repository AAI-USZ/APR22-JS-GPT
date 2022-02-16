var qs = require('qs');
var parseUrl = require('parseurl');



module.exports = function query(options){
return function query(req, res, next){
if (!req.query) {
req.query = ~req.url.indexOf('?')
? qs.parse(parseUrl(req).query, options)
: {};
}

next();
};
};
