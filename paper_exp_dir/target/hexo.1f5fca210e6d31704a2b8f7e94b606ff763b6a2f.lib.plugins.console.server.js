var express = require('express'),
var app = express();
if (config.logger_format) app.use(express.logger(config.logger_format));
