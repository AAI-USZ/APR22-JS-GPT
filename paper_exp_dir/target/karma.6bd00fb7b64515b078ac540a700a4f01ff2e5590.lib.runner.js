var constant = require('./constants');
var port = config.runnerPort || constant.DEFAULT_RUNNER_PORT;
var socket = net.connect(port);
