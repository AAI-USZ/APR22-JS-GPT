
describe 'Express'
describe 'Static'
before
use(require('express/plugins/static').Static, { path: 'spec/fixtures' })
end










