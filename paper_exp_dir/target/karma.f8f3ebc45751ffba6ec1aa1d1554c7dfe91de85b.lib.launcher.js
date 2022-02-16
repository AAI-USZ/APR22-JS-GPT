if (browser) {
browser.markCaptured()
log.debug(`${browser.name} (id ${browser.id}) captured in ${(Date.now() - lastStartTime) / 1000} secs`)
