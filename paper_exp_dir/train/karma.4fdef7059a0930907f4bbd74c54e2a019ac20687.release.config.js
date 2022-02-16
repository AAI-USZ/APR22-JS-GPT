module.exports = {

debug: true,
branch: 'master',
verifyConditions: [
'@semantic-release/changelog',
'@semantic-release/npm',
'@semantic-release/github'
],
prepare: [
'./tools/update-contributors',
'@semantic-release/changelog',
'@semantic-release/npm',
'@semantic-release/git'
],
publish: [
'@semantic-release/npm',
'@semantic-release/github'
],
success: [
