/* Server */

// https://dev.evernote.com/doc/articles/authentication.php
const serviceName = 'evernote'
_ = lodash

Evernote = {}
Evernote = Npm.require("evernote").Evernote

let querystring = Npm.require("querystring")
//declare let Async

let _config = ServiceConfiguration.configurations.findOne({service: serviceName})
let _sandbox =  _config ? _config.sandbox || false : false
let _sub = 'www'
if (_sandbox === true) _sub = 'sandbox'

let urls = {
	requestToken: "https://" + _sub + ".evernote.com/oauth", // first request
	authorize:    "https://" + _sub + ".evernote.com/oauth",
	accessToken:  "https://" + _sub + ".evernote.com/oauth",
	authenticate: "https://" + _sub + ".evernote.com/OAuth.action"
}
// https://app.yinxiang.com/ for China


OAuth.registerService(serviceName, 1, urls, (oauthBinding) => {
	let serviceData = {
			id:       oauthBinding.userId
			,name:    "username"
			,sandbox: oauthBinding._config.sandbox
		}
	let whitelisted = [ 'accessToken', 'accessTokenSecret', 'noteStoreUrl', 'webApiUrlPrefix', 'shard', 'expiresAt', 'sandbox' ]
	let fields = _.pick(oauthBinding, whitelisted)
    _.extend(serviceData, fields)

	let identity = getIdentity(serviceData.accessToken, serviceData.sandbox)
	whitelisted = [ 'name', 'active', 'username', 'privilege',
                    'premiumServiceStatus', 'premiumServiceStart', 'premiumServiceSKU', 'timezone' ]
    if (identity) {
		fields = _.pick(identity, whitelisted)
    	_.extend(serviceData, fields)
    }
	return {
		serviceData: serviceData,
		options: {
			profile: { name: serviceData.name, timezone: serviceData.timezone }
		}
	}
})


OAuth1Binding.prototype.prepareAccessToken = function(query, requestTokenSecret) {
	let self = this
	if (requestTokenSecret)
		self.accessTokenSecret = requestTokenSecret
	let headers = self._buildHeader({
		oauth_token: query.oauth_token,
		oauth_verifier: query.oauth_verifier
	})

	let response = self._call('POST', self._urls.accessToken, headers)
	let tokens = querystring.parse(response.content)

	// Fix for native function from OAuth1 library, which considers that secret could not be empty string.
	if (tokens.oauth_token === undefined || tokens.oauth_token_secret === undefined) { // TODO: commit to Meteor repo
		let error = new Error("missing oauth token or secret")
		// We provide response only if no token is available, we do not want to leak any tokens
		if (! tokens.oauth_token && ! tokens.oauth_token_secret) {
			_.extend(error, {response: response})
		}
		throw error
	}
	self.accessToken = tokens.oauth_token
	self.accessTokenSecret = tokens.oauth_token_secret

	self.shard = tokens.edam_shard
	self.expiresAt = tokens.edam_expires
	self.noteStoreUrl = tokens.edam_noteStoreUrl
	self.userId = tokens.edam_userId
	self.webApiUrlPrefix = tokens.edam_webApiUrlPrefix
}


let getIdentity = (accessToken, sandbox) => {
	try {
		let client = new Evernote.Client({token: accessToken, sandbox: sandbox})
		let userStore = client.getUserStore()
		let userData = Async.wrap(userStore, "getUser")()
		if (userData) return userData
	} catch(e) {
		// throw _.extend(new Error("(Evernote API): Could not fetch user profile: " + e.message),
        //         {response: e.response})
		// console.log( "ERROR (Evernote API): Could not fetch user profile: ", e.message )
		return {}
	}
}


Evernote.retrieveCredential = (credentialToken, credentialSecret) => OAuth.retrieveCredential(credentialToken, credentialSecret)

