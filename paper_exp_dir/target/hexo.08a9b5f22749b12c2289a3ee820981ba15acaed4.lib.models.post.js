if (config.relative_link) partial_url = '/' + partial_url;
return config.url + _.replace(partial_url, config.root, '/');
});
