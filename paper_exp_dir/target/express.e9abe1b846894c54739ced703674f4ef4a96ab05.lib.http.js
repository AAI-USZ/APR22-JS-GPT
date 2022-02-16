base = this.set('basepath') || this.route;
if ('/' == base) base = '';
base = base + (app.set('basepath') || app.route);
