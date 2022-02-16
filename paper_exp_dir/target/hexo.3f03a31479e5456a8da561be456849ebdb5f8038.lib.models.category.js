const { config } = ctx;
let partial_url = this.path;
if (config.pretty_urls.trailing_index === false) partial_url = partial_url.replace(/index\.html$/, '');
