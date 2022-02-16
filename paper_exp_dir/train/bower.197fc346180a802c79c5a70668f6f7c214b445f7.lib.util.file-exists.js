







var fs = require('fs');




module.exports = function (path, callback) {
fs.stat(path, function (error) {
callback(!error || error.code !== 'ENOENT');
});
};

module.exports.sync = function (path, callback) {
try {
return !!fs.statSync(path);
} catch (e) {
return e.code !== 'ENOENT';
}
};
