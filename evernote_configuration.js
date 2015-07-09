Template.configureLoginServiceDialogForEvernote.helpers({
	siteUrl: function () {
		return Meteor.absoluteUrl();
	}
});

Template.configureLoginServiceDialogForEvernote.fields = function () {
	return [
		{property: 'consumerKey', label: 'Consumer Key'}
		,{property: 'secret', label: 'Consumer Secret'}
		// ,{property: 'sandbox', label: 'Sandbox mode'}
	];
};
