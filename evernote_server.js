// https://dev.evernote.com/doc/articles/authentication.php
const serviceName = 'evernote';

Evernote = {};
Evernote = Npm.require("evernote").Evernote;

var querystring = Npm.require("querystring");
//declare var Async;

var _config = ServiceConfiguration.configurations.findOne({service: serviceName});
var _sandbox =  _config ? _config.sandbox || false : false;
var _sub = 'www';
if (_sandbox === true) _sub = 'sandbox';

var urls = {
	requestToken: "https://" + _sub + ".evernote.com/oauth", // first request
	authorize:    "https://" + _sub + ".evernote.com/oauth",
	accessToken:  "https://" + _sub + ".evernote.com/oauth",
	authenticate: "https://" + _sub + ".evernote.com/OAuth.action"
};
// https://app.yinxiang.com/ for China


OAuth.registerService(serviceName, 1, urls, function(oauthBinding) {
	var serviceData = {
			id:                 oauthBinding.userId
			,name:              "username"
			,expiresAt:         oauthBinding.expires
			,sandbox:			oauthBinding._config.sandbox
		};
	var whitelisted = [ 'accessToken', 'accessTokenSecret', 'noteStoreUrl', 'webApiUrlPrefix', 'shard' ];
	var fields = _.pick(oauthBinding, whitelisted);
    _.extend(serviceData, fields);

	var identity = getIdentity(serviceData.accessToken, serviceData.sandbox);
	whitelisted = [ 'name', 'active', 'username', 'privilege',
                    'premiumServiceStatus', 'premiumServiceStart', 'premiumServiceSKU', 'timezone' ];
    if (identity) {
		fields = _.pick(identity, whitelisted);
    	_.extend(serviceData, fields);
    }

	return {
		serviceData: serviceData,
		options: {
			profile: { name: serviceData.name, timezone: serviceData.timezone }
		}
	};
});


OAuth1Binding.prototype.prepareAccessToken = function(query, requestTokenSecret) {
	var self = this;
	if (requestTokenSecret)
		self.accessTokenSecret = requestTokenSecret;
	var headers = self._buildHeader({
		oauth_token: query.oauth_token,
		oauth_verifier: query.oauth_verifier
	});

	var response = self._call('POST', self._urls.accessToken, headers);
	var tokens = querystring.parse(response.content);

	// Fix for native function from OAuth1 library, which considers that secret could not be empty string.
	if (tokens.oauth_token === undefined || tokens.oauth_token_secret === undefined) { // TODO: commit to Meteor repo
		var error = new Error("missing oauth token or secret");
		// We provide response only if no token is available, we do not want to leak any tokens
		if (! tokens.oauth_token && ! tokens.oauth_token_secret) {
			_.extend(error, {response: response});
		}
		throw error;
	}
	self.accessToken = tokens.oauth_token;
	self.accessTokenSecret = tokens.oauth_token_secret;

	self.shard = tokens.edam_shard;
	self.expires = tokens.edam_expires;
	self.noteStoreUrl = tokens.edam_noteStoreUrl;
	self.userId = tokens.edam_userId;
	self.webApiUrlPrefix = tokens.edam_webApiUrlPrefix;
};


var getIdentity = function (accessToken, sandbox) {
	try {
		var client = new Evernote.Client({token: accessToken, sandbox: sandbox});
		var userStore = client.getUserStore();
		var userData = Async.wrap(userStore, "getUser")();
		if (userData) return userData;
	} catch(e) {
		//throw _.extend(new Error("(Evernote API): Could not fetch user profile: " + e.message),
         //        {response: e.response});
		console.log( "ERROR (Evernote API): Could not fetch user profile: ", e.message );
	}
};


Evernote.retrieveCredential = function(credentialToken, credentialSecret) {
	return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
