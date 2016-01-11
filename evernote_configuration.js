Template.configureLoginServiceDialogForEvernote.helpers({
	siteUrl: () => Meteor.absoluteUrl()
})


Template.configureLoginServiceDialogForEvernote.fields = () =>
	[
		{property: 'consumerKey', label: 'Consumer Key'}
		,{property: 'secret', label: 'Consumer Secret'}
		// ,{property: 'sandbox', label: 'Sandbox mode'}
	]

