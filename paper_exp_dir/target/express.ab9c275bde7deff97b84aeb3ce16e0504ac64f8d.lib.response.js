options.maxAge /= 1000;
this.set('Set-Cookie', cookie.serialize(name, String(val), options));
return this;
