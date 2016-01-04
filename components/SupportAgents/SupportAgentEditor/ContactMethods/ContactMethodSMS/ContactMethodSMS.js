define(["libs/knockout"], function ContactMethodSMSViewModel(ko) {
	return function() {
		var self = this;
		self.type = "Sms";
		self.countryCode=ko.observable("");
		self.number=ko.observable("");
	};
});