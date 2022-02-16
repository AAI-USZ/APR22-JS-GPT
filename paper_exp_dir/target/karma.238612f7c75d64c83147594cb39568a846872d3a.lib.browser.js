log.error('FAILED: %d PASSED: %d', this.lastResult.failed, this.lastResult.success);

var LINE_LENGTH = 140 - this.name.length - (result.success ? 9 : 10)   - 6;
