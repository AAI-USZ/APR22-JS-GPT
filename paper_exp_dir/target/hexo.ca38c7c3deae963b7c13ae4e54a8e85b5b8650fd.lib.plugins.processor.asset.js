const { extname, relative } = require('path');
const id = relative(ctx.base_dir, file.source).replace(/\\/g, '/');
