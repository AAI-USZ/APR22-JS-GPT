var msg;
var tarballUrl = 'https://github.com/' + this._org + '/' + this._repo + '/archive/' + this._resolution.tag + '.tar.gz';
var file = path.join(this._tempDir, 'archive.tar.gz');
