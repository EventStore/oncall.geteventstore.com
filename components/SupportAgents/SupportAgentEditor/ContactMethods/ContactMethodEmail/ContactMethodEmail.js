define(["libs/knockout"], function(ko) {
	return function() {
		var self = this;
		self.type="Email";
		self.address=ko.observable("");
		
	};
});