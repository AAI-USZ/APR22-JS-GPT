

"use strict";

const Module = require("module");
const path = require("path");


const createRequire = (


Module.createRequire ||


Module.createRequireFromPath ||


(filename => {
const mod = new Module(filename, null);

mod.filename = filename;
mod.paths = Module._nodeModulePaths(path.dirname(filename));
mod._compile("module.exports = require;", filename);
return mod.exports;
})
);

module.exports = {


resolve(moduleName, relativeToPath) {
try {
return createRequire(relativeToPath).resolve(moduleName);
} catch (error) {
if (
typeof error === "object" &&
error !== null &&
error.code === "MODULE_NOT_FOUND" &&
!error.requireStack &&
error.message.includes(moduleName)
) {
error.message += `\nRequire stack:\n- ${relativeToPath}`;
}
throw error;
}
}
};
