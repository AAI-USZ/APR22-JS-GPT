const { config } = ctx;
let partial_url = this.path;
if (config.canonical_url) partial_url = partial_url.replace(/index\.html$/, '');
