var processor = hexo.extend.processor,
rHiddenFile = /^[^_](?:(?!\/_).)*$/,
rTmpFile = /[~%]$/;

processor.register('_posts/*path', require('./post'));
