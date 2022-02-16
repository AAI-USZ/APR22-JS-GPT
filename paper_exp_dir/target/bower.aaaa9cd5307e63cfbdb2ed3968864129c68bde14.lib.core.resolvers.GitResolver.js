process.env.GIT_TERMINAL_PROMPT = config.interactive ? '1' : '0';

Resolver.call(this, decEndpoint, config, logger);
