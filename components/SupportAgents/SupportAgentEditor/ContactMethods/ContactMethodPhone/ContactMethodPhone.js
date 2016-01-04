define(["libs/knockout"], function(ko) {
	return function() {
		var self =this;
		self.type = "Phone";
		self.countryCode=ko.observable("");
		self.number=ko.observable("");
	};
});