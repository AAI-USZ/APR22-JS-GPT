


var express = require('../../')
, app = module.exports = express();



var users = [
{ name: 'tj' }
, { name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
, { name: 'bandit' }
];



app.param(['to', 'from'], function(req, res, next, num, name){
req.params[name] = num = parseInt(num, 10);
if( isNaN(num) ){
next(new Error('failed to parseInt '+num));
} else {
next();
}
});
