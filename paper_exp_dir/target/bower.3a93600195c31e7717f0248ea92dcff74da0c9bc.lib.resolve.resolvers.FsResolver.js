return Q.reject(createError('File system sources can\'t resolve targets', 'ENORESTARGET'));
return Q.reject(createError('File system sources can\'t resolve targets', 'ENORESTARGET'));
.then(this._extract.bind(this))
