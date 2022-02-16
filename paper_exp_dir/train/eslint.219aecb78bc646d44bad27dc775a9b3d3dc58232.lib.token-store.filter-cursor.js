
"use strict";





const DecorativeCursor = require("./decorative-cursor");






module.exports = class FilterCursor extends DecorativeCursor {


constructor(cursor, predicate) {
super(cursor);
this.predicate = predicate;
}


moveNext() {
const predicate = this.predicate;

while (super.moveNext()) {
if (predicate(this.current)) {
return true;
}
}
return false;
}
};
