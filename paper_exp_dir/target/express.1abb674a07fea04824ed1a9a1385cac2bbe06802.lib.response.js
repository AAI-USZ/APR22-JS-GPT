
if (err && !self._header) self.removeHeader('Content-Disposition');
if (fn) return fn(err);
