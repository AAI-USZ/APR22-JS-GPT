const { extname } = require('path');
if (!extname(data.path)) {
data.path = `${path.substring(0, path.length - extname(path).length)}.${output}`;
