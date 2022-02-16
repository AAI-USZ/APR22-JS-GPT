command('cp', ['-r', publicDir, deployDir], {}, next);
} else {
log.error('You have to use `%s` to generate files first.', clc.bold('hexo generate'));
