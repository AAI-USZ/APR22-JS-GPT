var io = require('socket.io'),
net = require('net'),
cfg = require('./config'),
ws = require('./web-server'),
logger = require('./logger'),
util = require('./util');

var STATIC_FOLDER = __dirname + '/../static/';

exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

var log = logger.create();
var fileGuardian = new cfg.FileGuardian(config.files, config.autoWatch);
log.info('Starting web server at http://localhost:' + config.port);
var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER).listen(config.port);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});


socketServer.sockets.on('connection', function (socket) {
var browserName;
var browserLog = log;
log.debug('New browser has connected.');

socket.on('result', function (result) {
var LINE_LENGTH = 140;
var PASSED = '\033[32mPASSED\033[39m';
var FAILED = '\033[31mFAILED\033[39m';

var msg = result.suite.join('.') + ' ' + result.description;


msg += new Array(LINE_LENGTH - browserName.length - 9 - msg.length - 6).join('.');
msg += result.success ? PASSED : FAILED;
browserLog.info(msg);

if (!result.success) {
