const { execSync } = require('child_process')
const { dirSync } = require('tmp')

const success = async (pluginConfig, { nextRelease, logger }) => {
const [major, minor] = nextRelease.version.split('.')
const docsVersion = `${major}.${minor}`

const { name: docsPath } = dirSync()





const repoOrigin = `https:

const options = { encoding: 'utf8', cwd: docsPath }

logger.log(execSync(`git clone ${repoOrigin} .`, options))
logger.log(execSync('npm ci', options))
logger.log(execSync(`./sync-docs.sh "${nextRelease.gitTag}" "${docsVersion}"`, options))
logger.log(execSync('git push origin master', options))
}

module.exports = { success }
