Package.describe({
	name: 'priezz:evernote',
	summary: "Evernote OAuth flow",
	version: "0.3.0",
	git: "https://github.com/priezz/meteor-evernote.git"
});

Npm.depends({
	 "evernote": "1.25.8"
	// "url": "1.1.0"
});

Package.onUse(function(api) {
	api.versionsFrom('1.0.1')

	api.use('oauth', ['client', 'server']);
	api.use('oauth1', ['client', 'server']);
	api.use('http', 'server');
	// api.use('npm-container', 'server');
	api.use('templating', 'client');
	api.use('underscore', 'server');
	api.use('random', 'client');
	api.use('service-configuration', ['client', 'server']);

	api.addFiles('evernote_server.js', 'server');
	api.addFiles('evernote_client.js', 'client');

	api.export('Evernote');

	api.addFiles([
		'evernote_configuration.html',
		'evernote_configuration.js'
	], 'client');
});

