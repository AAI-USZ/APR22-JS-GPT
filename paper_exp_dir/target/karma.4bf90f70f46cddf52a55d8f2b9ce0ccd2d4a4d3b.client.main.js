var updater = new StatusUpdater(socket, util.elm('title'), util.elm('banner'), util.elm('browsers'))
window.karma = new Karma(updater, socket, util.elm('context'), window.open,
