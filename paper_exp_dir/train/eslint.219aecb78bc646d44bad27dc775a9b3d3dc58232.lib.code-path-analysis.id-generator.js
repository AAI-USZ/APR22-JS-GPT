

"use strict";






class IdGenerator {


constructor(prefix) {
this.prefix = String(prefix);
this.n = 0;
}


next() {
this.n = 1 + this.n | 0;


if (this.n < 0) {
this.n = 1;
}

return this.prefix + this.n;
}
}

module.exports = IdGenerator;
