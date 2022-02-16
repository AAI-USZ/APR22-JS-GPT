this.registry = new RegistryClient();
expect(this.registry instanceof RegistryClient).to.be.ok;
expect(this.registry).to.have.ownProperty('_config');
