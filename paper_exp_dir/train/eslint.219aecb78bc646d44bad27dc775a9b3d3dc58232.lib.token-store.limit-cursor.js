
"use strict";





const DecorativeCursor = require("./decorative-cursor");






module.exports = class LimitCursor extends DecorativeCursor {


constructor(cursor, count) {
super(cursor);
this.count = count;
}


moveNext() {
if (this.count > 0) {
this.count -= 1;
return super.moveNext();
}
return false;
}
};
