const { extname, join } = require('path');
name: item.substring(0, item.length - extname(item).length),
path: join(scaffoldDir, item)
