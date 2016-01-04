define(['libs/knockout'],
	function LoginViewModel(ko){
		return function(params){
			var self = this;

			self.canLogin = params.selectedCallback || function() {};
			self.username = ko.observable("");
			self.password = ko.observable("");
			self.loginError = ko.observable(false);
			self.isLoggingIn = ko.observable(false);

			console.log("LoginViewModel Params: " + params);

			self.checkLogin = function() {
				
				var loginRequest = new XMLHttpRequest();
				base_auth_string(self.username(),self.password());
				console.log(userAccessKey);
				loginRequest.open('GET',window.Config.APIBaseUrl + 'login/',true);
				loginRequest.setRequestHeader('Content-Type', 'application/json'); 
                loginRequest.setRequestHeader('Authorization', userAccessKey);

                loginRequest.onload = function(){
                	if(this.status >= 200 && this.status < 400)
                	{
                		self.loginError(false);
                		self.canLogin(true);
                		self.isLoggingIn(false);
                		window.Config.lastDate = moment().format();
                	}
                	else
                	{
                		self.loginError(true);
                		self.canLogin(false);
                		self.isLoggingIn(false);
                	}

                };
                console.log("Sending LoginRequest");
                loginRequest.send();
				self.isLoggingIn(true);
			};

		};
	});

function base_auth_string(user, password){
	var token = user + ':' + password;
	var hash = btoa(token);
	userAccessKey = "Basic" + hash;
}


