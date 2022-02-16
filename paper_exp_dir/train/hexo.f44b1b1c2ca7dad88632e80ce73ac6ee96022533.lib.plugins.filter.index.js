var filter = hexo.extend.filter;

filter.register('pre', require('./backtick_code_block'));
filter.register('pre', require('./titlecase'));

