
ejs = require('ejs')
helpers = require('express/plugins/view').helpers

describe 'Express'
before_each
reset()
end

describe 'View'
describe 'set("views")'
it 'should default to <root>/views'
