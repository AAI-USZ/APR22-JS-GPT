
"use strict";





const Ajv = require("ajv"),
metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");





module.exports = (additionalOptions = {}) => {
const ajv = new Ajv({
meta: false,
useDefaults: true,
validateSchema: false,
missingRefs: "ignore",
verbose: true,
schemaId: "auto",
...additionalOptions
});

ajv.addMetaSchema(metaSchema);

ajv._opts.defaultMeta = metaSchema.id;

return ajv;
};
