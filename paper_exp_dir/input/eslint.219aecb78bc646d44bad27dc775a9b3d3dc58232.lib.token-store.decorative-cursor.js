
"use strict";





const Cursor = require("./cursor");






module.exports = class DecorativeCursor extends Cursor {


constructor(cursor) {
super();
this.cursor = cursor;
}


moveNext() {
const retv = this.cursor.moveNext();

this.current = this.cursor.current;

return retv;
}
};
