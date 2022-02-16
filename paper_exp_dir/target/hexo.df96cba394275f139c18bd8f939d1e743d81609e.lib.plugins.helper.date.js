return result(date || new Date(), format || this.config.date_format);
return result(date || new Date(), format || this.config.time_format);
return result(date || new Date(), format || this.config.date_format + ' ' + this.config.time_format);
