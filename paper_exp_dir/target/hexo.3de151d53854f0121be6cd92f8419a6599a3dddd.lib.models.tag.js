const { config } = ctx;
let partial_url = this.path;
if (config.trailing_url.trailing_index === false) partial_url = partial_url.replace(/index\.html$/, '');
