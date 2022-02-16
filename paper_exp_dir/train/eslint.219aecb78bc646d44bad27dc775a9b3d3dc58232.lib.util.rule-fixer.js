
"use strict";












function insertTextAt(index, text) {
return {
range: [index, index],
text
};
}







const ruleFixer = Object.freeze({


insertTextAfter(nodeOrToken, text) {
return this.insertTextAfterRange(nodeOrToken.range, text);
},


insertTextAfterRange(range, text) {
return insertTextAt(range[1], text);
},


insertTextBefore(nodeOrToken, text) {
return this.insertTextBeforeRange(nodeOrToken.range, text);
},


insertTextBeforeRange(range, text) {
return insertTextAt(range[0], text);
},


replaceText(nodeOrToken, text) {
return this.replaceTextRange(nodeOrToken.range, text);
},


replaceTextRange(range, text) {
return {
range,
text
};
},


remove(nodeOrToken) {
return this.removeRange(nodeOrToken.range);
},


removeRange(range) {
return {
range,
text: ""
};
}

});


module.exports = ruleFixer;
