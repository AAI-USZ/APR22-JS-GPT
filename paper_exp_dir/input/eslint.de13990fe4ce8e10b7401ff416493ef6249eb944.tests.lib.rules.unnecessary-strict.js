





var eslintTester = require("../../../lib/tests/eslintTester");

valid: [
"\"use strict\"; function foo() { var bar = true; }",
"'use strict'; function foo() { var bar = true; }",
"function foo() { \"use strict\"; var bar = true; }",
"function foo() { 'use strict'; var bar = true; }",
"function foo() { 'use strict'; f('use strict'); }",
"function foo() { 'use strict'; { 'use strict'; } }"
],
invalid: [
{ code: "\"use strict\"; function foo() { \"use strict\"; var bar = true; }",
errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
{ code: "'use strict'; function foo() { 'use strict'; var bar = true; }",
errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
{ code: "\"use strict\"; (function foo() { function bar () { \"use strict\"; } }());",
errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
{ code: "'use strict'; (function foo() { function bar () { 'use strict'; } }());",
errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
{ code: "(function foo() { 'use strict'; 'use strict'; }());",
errors: [{ message: "Multiple 'use strict' directives.", type: "Literal"}] }
]
});
