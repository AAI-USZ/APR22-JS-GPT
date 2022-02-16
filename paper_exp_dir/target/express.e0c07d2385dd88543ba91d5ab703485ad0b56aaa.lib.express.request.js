if (typeof self.response.status != 'number'){ callback( new InvalidStatusCode(self.response.status) ); return; }
