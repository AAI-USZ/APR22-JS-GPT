var config   = require('./config');
return fs.rename(this.path, this.localPath, function (err) {
if(err && err.code === 'EXDEV'){
