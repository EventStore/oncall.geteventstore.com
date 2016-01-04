define(['libs/knockout'],
	function TicketListViewModel(ko){
		return function(){
			self.collectedTickets = ko.observableArray([]);


			function loadTicketData(statusString){
				var getRequest = new XMLHttpRequest();
				getRequest.open('GET',window.Config.APIBaseUrl + 'ticket-handler/all?filter=New-AwaitingAck',true);
				getRequest.setRequestHeader('Content-Type','application/json');

				getRequest.onload = function() {
					 if(this.status >= 200 && this.status < 400){
					 	var data = JSON.parse(this.response);
					 	self.collectedTickets(data);
					 } else {

					 }
				};

				getRequest.onerror = function() {

				};

				getRequest.send();
			}

			loadTicketData(""); //Change needed.
			console.log(self.collectedTickets);
		};
	});