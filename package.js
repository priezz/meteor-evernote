Package.describe({
	name: 'priezz:evernote',
	summary: "Evernote OAuth flow",
	version: "0.4.1",
	git: "https://github.com/priezz/meteor-evernote.git"
})
// 0.4.0 - ES6 support
// 0.4.1 - fix loginStyle for mobile

Npm.depends({
	 "evernote": "1.25.8"
})


Package.onUse(function(api) {
	api.versionsFrom('1.2')

	api.use('ecmascript')
	api.use('oauth', ['client', 'server'])
	api.use('oauth1', ['client', 'server'])
	api.use('http', 'server')
	api.use('templating', 'client')
	api.use('erasaur:meteor-lodash@3.10.1_1', 'server')
	api.use('random', 'client')
	api.use('service-configuration', ['client', 'server'])

	api.addFiles('evernote_server.js', 'server')
	api.addFiles('evernote_client.js', 'client')

	api.export('Evernote')

	api.addFiles([
		'evernote_configuration.html',
		'evernote_configuration.js'
	], 'client')
})

