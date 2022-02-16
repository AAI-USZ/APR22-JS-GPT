var renderer = hexo.extend.renderer;

var html = require('./html');

renderer.register('htm', 'html', html, true);
renderer.register('html', 'html', html, true);

var markdown = require('./markdown');

renderer.register('md', 'html', markdown, true);
renderer.register('markdown', 'html', markdown, true);
renderer.register('mkd', 'html', markdown, true);
renderer.register('mkdn', 'html', markdown, true);
renderer.register('mdwn', 'html', markdown, true);
