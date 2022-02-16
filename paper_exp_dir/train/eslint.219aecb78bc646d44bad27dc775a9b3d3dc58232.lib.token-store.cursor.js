
"use strict";






module.exports = class Cursor {


constructor() {
this.current = null;
}


getOneToken() {
return this.moveNext() ? this.current : null;
}


getAllTokens() {
const tokens = [];

while (this.moveNext()) {
tokens.push(this.current);
}

return tokens;
}



moveNext() {
throw new Error("Not implemented.");
}
};
