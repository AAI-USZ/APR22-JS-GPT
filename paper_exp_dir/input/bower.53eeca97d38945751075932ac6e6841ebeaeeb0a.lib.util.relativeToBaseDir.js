var path = require('path');
var isPathAbsolute = require('./isPathAbsolute');

function relativeToBaseDir(baseDir) {
if(isPathAbsolute(filePath)) {
return path.resolve(filePath);
} else {
return path.resolve(baseDir, filePath);
}
};
}

module.exports = relativeToBaseDir;
