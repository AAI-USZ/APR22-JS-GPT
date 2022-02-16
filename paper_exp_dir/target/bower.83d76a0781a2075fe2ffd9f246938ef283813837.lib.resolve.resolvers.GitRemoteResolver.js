'Available branches in "' + source + '" are: ' + branches.join(', ');
return  this._fetchRefs(source)
.then(function (refs) {
