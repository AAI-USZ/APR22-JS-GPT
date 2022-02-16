this.get('Content-Type') || this.set('Content-Type', 'application/json');

return this.send(body);
