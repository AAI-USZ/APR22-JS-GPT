changeFile (path, force) {
if (!force && stat.mtime <= file.mtime) throw new Promise.CancellationError()
this._emitModified(force)
