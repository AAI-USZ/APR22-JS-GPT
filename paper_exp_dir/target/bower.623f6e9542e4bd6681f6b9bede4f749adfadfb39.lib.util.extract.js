var tar = require('tar-fs');
.pipe(tar.extract(dst, {
ignore: isSymlink
