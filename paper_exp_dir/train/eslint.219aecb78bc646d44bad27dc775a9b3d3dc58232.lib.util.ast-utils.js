

"use strict";





const esutils = require("esutils");
const espree = require("espree");
const lodash = require("lodash");
const {
breakableTypePattern,
createGlobalLinebreakMatcher,
lineBreakPattern,
shebangPattern
} = require("../../shared/ast-utils");




