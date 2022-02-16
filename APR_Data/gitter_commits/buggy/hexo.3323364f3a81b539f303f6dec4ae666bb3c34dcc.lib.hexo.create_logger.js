var bunyan = require('bunyan');
var moment = require('moment');

var dateFormat = 'HH:mm:ss.SSS';

var levelNames = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO ',
  40: 'WARN ',
  50: 'ERROR',
  60: 'FATAL'
};

var levelColors = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'yellow',
  50: 'red',
  60: 'magenta'
};

require('colors');

function ConsoleStream(env){
  this.debug = env.debug;
}

ConsoleStream.prototype.write = function(data){
  var level = data.level;
  var msg = '';

  // Time
  if (this.debug){
    msg += moment(data.time).format(dateFormat).gray + ' ';
  }

  // Level
  msg += levelNames[level][levelColors[level]] + ' ';

  // Message
  msg += data.msg + '\n';

  // Error
  if (data.err){
    msg += data.err.stack.grey + '\n';
  }

  process.stdout.write(msg);
};

function createLogger(env){
  var streams = [];
  var timer = {};

  if (!env.silent){
    streams.push({
      type: 'raw',
      level: env.debug ? 'trace' : 'info',
      stream: new ConsoleStream(env)
    });
  }

  if (env.debug){
    streams.push({
      level: 'trace',
      path: 'debug.log'
    });
  }

  var logger = this.log = bunyan.createLogger({
    name: 'hexo',
    streams: streams,
    serializers: {
      err: bunyan.stdSerializers.err
    }
  });

  // Alias for logger levels
  logger.d = logger.debug;
  logger.i = logger.info;
  logger.w = logger.warn;
  logger.e = logger.error;
  logger.log = logger.info;

  return logger;
}

module.exports = createLogger;