


;(function(){

JSpec = {
version   : '4.0.0',
assert    : true,
cache     : {},
suites    : [],
modules   : [],
allSuites : [],
sharedBehaviors: [],
matchers  : {},
stubbed   : [],
options   : {},
request   : 'XMLHttpRequest' in this ? XMLHttpRequest : null,
stats     : { specs: 0, assertions: 0, failures: 0, passes: 0, specsFinished: 0, suitesFinished: 0 },



defaultContext : {



