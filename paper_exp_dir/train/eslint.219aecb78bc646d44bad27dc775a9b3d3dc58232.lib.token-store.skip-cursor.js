
"use strict";





const DecorativeCursor = require("./decorative-cursor");






module.exports = class SkipCursor extends DecorativeCursor {


constructor(cursor, count) {
super(cursor);
this.count = count;
}


moveNext() {
while (this.count > 0) {
this.count -= 1;
if (!super.moveNext()) {
return false;
}
}
return super.moveNext();
}
};
