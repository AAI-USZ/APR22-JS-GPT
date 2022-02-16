


var express = require('../../lib/express');


var RedisStore = require('connect-redis');

var app = express.createServer(
express.logger(),


express.cookieParser(),





express.session({ secret: 'keyboard cat', store: new RedisStore })
);
