this.path = path;
this.source = pathFn.join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;
