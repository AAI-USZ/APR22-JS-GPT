if ((this.statusCode >= 200 && this.statusCode < 300) || this.statusCode === 304) {
if (req.fresh) this.statusCode = 304;
}
