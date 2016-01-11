/* Client */

const serviceName = 'evernote'

Evernote = {}


Evernote.requestCredential = (options, credentialRequestCompleteCallback) => {
	if (!credentialRequestCompleteCallback && typeof options === 'function') {
		credentialRequestCompleteCallback = options
		options = {}
	}

	let config = ServiceConfiguration.configurations.findOne({service: serviceName})
	if (!config) {
		credentialRequestCompleteCallback && credentialRequestCompleteCallback( new ServiceConfiguration.ConfigError() )
		return
	}

	let credentialToken = Random.secret()
	let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
	// let loginStyle = mobile || Meteor.isCordova ? "touch" : "popup"
	let loginStyle = mobile || Meteor.isCordova ? "redirect" : config.loginStyle || "redirect"

	// We need to keep credentialToken across the next two 'steps' so we're adding
	// a credentialToken parameter to the url and the callback url that we'll be returned
	// to by oauth provider
	let loginUrl = "_oauth/" + serviceName + "/?requestTokenAndRedirect=true" + '&state=' + OAuth._stateParam(loginStyle, credentialToken)
	if (Meteor.isCordova) {
		loginUrl = loginUrl + "&cordova=true"
		if (/Android/i.test(navigator.userAgent)) {
			loginUrl = loginUrl + "&android=true"
		}
	}
	loginUrl = Meteor.absoluteUrl(loginUrl)

	OAuth.launchLogin({
		loginService: serviceName
		, loginStyle: loginStyle
		, loginUrl: loginUrl
		, credentialRequestCompleteCallback: credentialRequestCompleteCallback
		, credentialToken: credentialToken
		, popupOptions: { height: 600 }
	})
}
