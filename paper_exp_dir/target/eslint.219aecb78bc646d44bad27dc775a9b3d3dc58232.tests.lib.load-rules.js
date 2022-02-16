const loadRules = require("../../../lib/cli-engine/load-rules");
assert.strictEqual(rules["fixture-rule"], require(require.resolve("../../fixtures/rules/fixture-rule")));
