

var express = require('../../');

var app = module.exports = express();





function error(status, msg) {
var err = new Error(msg);
err.status = status;
return err;
}

