var connect = require('connect'),
  config = hexo.config,
  log = require('./util').log;

var app = connect.createServer();

module.exports = function(){
  app.use(connect.static(hexo.public_dir));
  app.use(connect.compress());

  app.listen(config.port, function(){
    log.info('Hexo is running on http://localhost:%d', config.port);
  });
};