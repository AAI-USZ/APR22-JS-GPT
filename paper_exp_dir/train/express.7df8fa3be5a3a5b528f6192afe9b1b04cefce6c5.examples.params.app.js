


var express = require('../../')
, app = module.exports = express();



var users = [
{ name: 'tj' }
, { name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
, { name: 'bandit' }
];



function createError(status, message) {
var err = new Error(message);
err.status = status;
return err;
}



app.param(['to', 'from'], function(req, res, next, num, name){
req.params[name] = parseInt(num, 10);
