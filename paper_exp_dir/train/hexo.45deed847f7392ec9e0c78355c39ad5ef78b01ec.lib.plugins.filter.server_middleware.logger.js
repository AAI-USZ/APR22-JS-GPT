var morgan = require('morgan');

module.exports = function(app){
var config = this.config;
var args = this.env.args || {};
var format = args.l || args.log || config.logger_format;

if (typeof format !== 'string') format = 'dev';

app.use(morgan(format));
};
