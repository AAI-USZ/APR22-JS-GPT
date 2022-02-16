require('ts-node')
if (path.extname(configFilePath) === '.ts' && TYPE_SCRIPT_AVAILABLE) {
require('ts-node').register()
