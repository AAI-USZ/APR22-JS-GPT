paginator('/' + config.archive_dir + '/', posts, 'archive', render, next);
paginator('/' + config.archive_dir + '/' + ykey + '/', yearly[ykey], 'archive', render, next);
paginator('/' + config.archive_dir + '/' + ykey + '/' + mkey + '/', monthly[ykey][mkey], 'archive', render, next);
