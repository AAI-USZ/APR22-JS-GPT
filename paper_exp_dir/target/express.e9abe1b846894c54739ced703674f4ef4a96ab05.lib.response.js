if (undefined === options.path) options.path = this.app.set('basepath');
, base = app.set('basepath') || app.route
if ('/' != base && 0 != url.indexOf(base)) url = base + url;
