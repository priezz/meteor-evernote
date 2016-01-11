meteor-evernote
============================

A meteor package for Evernote 0auth flow. *Meteor Accounts* and [*connect-with*](https://atmospherejs.com/mondora/connect-with) compatible.

Package Dependencies
----------------------

* oauth
* oauth1
* http
* templating
* underscore
* random
* service-configuration


Install
-----------
```
meteor add priezz:evernote
```

Use
-----

See [npm package description](https://github.com/evernote/evernote-sdk-js) for methods and examples.

Use [*priezz:accounts-evernote*](https://www.npmjs.com/package/evernote) packageto login using standard Meteor packages.

To work with [*mondora:connect-with*](https://atmospherejs.com/mondora/connect-with) package use:
```js
// The user must be already logged in with some other service
if (Meteor.user()) {
	Meteor.connectWith(Evernote);
}
```
The customary oauth popup will open and the user will be prompted to login to Evernote. When the popup closes, the Evernote service will both connected to the user account together with previously connected services.
