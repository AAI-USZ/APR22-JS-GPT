it('should update total specs count during execution', () => {
browser.state = Browser.STATE_EXECUTING
browser.onInfo({total: 20})
