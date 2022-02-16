
"use strict";







const assert = require("assert");





module.exports = {


describe: (typeof describe === "function") ? describe :   function(text, method) {
return method.apply(this);
},


it: (typeof it === "function") ? it :   function(text, method) {
return method.apply(this);
},


testEventGeneratorInterface(instance) {
this.describe("should implement EventGenerator interface", () => {
this.it("should have `emitter` property.", () => {
assert.equal(typeof instance.emitter, "object");
assert.equal(typeof instance.emitter.emit, "function");
});

this.it("should have `enterNode` property.", () => {
assert.equal(typeof instance.enterNode, "function");
});

this.it("should have `leaveNode` property.", () => {
assert.equal(typeof instance.leaveNode, "function");
});
});
}
};
