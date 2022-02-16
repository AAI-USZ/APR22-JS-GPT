

"use strict";





const { CLIEngine } = require("../cli-engine");


const { getCLIEngineInternalSlots } = require("../cli-engine/cli-engine");

const debug = require("debug")("eslint:source-code-utils");






function getSourceCodeOfFile(filename, engine) {
debug("getting sourceCode of", filename);
const results = engine.executeOnFiles([filename]);
