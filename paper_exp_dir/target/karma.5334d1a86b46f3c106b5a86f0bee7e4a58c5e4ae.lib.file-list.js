const prevFile = this._findFile(path, patternObject)
if (prevFile && file.mtime <= prevFile.mtime) {
log.debug(`Not preprocessing "${path}" as file hasn't been changed since the last preprocessing`)
