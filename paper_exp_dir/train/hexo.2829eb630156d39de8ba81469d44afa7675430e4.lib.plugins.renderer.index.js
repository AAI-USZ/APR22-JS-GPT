var renderer = hexo.extend.renderer;

renderer.register('ejs', 'html', require('./ejs'), true);

var html = require('./html');

