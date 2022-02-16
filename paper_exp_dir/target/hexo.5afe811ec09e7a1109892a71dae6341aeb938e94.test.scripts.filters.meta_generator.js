
should.not.exist(metaGenerator('<head><link><meta name="generator" content="foo"></head>'));
should.not.exist(metaGenerator('<head><link><meta content="foo" name="generator"></head>'));
