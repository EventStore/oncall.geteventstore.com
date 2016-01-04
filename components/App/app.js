define(
	['libs/knockout'],
	function(ko, supportAgents) {
	    ko.components.register('support-agents-widget', {
	        viewModel: { require: 'components/SupportAgents/SupportAgents' },
	        template: { require: 'text!components/SupportAgents/SupportAgents.html' }
	    });

	    ko.components.register('calendar-widget', {
	        viewModel: {require: 'components/Calendar/Calendar'},
	        template: {require: 'text!components/Calendar/Calendar.html'}
	    });

	    ko.components.register('login-widget', {
	    	viewModel: {require: 'components/Login/Login'},
	    	template: {require: 'text!components/Login/Login.html'}
	    });

	    ko.components.register('ticket-widget', {
	    	viewModel: {require: 'components/TicketList/TicketList'},
	    	template: {require: 'text!components/TicketList/TicketList.html'}
	    });

 		return function() {
	    	var self = this;

	    	self.selectedAgentId = ko.observable();
	    	self.isLoading = ko.observable(false);
	    	self.isLoggedIn = ko.observable(false);
	    	self.showTickets = ko.observable(false);
	    	self.selectedAgentName = ko.observable();
	    	self.selectedAgentColour = ko.observable();
	    	self.ticketsActive = ko.observable();
	    	self.ticketsNearSla = ko.observable();
	    	self.currentlyOnCall = ko.observable();
	    	self.selectedDates = ko.observableArray([]);
	    	self.errorMessages = ko.observableArray([]);
	    	self.showErrors = ko.computed(function() {
	    		if(self.errorMessages().length > 0)
	    			return true;

	    		return false;
	    	});

	    	self.isSuccess = ko.observable(false);
	    	GetInfo();
	    	function SaveDateRange(dateStart, dateEnd){
	    		var saveRequest = new XMLHttpRequest();
	    		saveRequest.open('PUT', window.Config.APIBaseUrl + 'schedule/range/?DateStart='+dateStart+'&DateEnd='+dateEnd,true);
	    		saveRequest.setRequestHeader('Accept','application/json');
	    		saveRequest.setRequestHeader('Authorization', userAccessKey);

	    		saveRequest.onload = function (){
	    			if(this.status >= 200 && this.status < 400){
	    				self.errorMessages.push("Success: " + this.responseText);
	    				self.isSuccess(true);
	    			}
	    			else
	    			{
	    				self.errorMessages.push(this.responseText);
	    				self.isSuccess(false);
	    			}
	    		};

	    		saveRequest.onerror = function (){

	    		};

	    		var toSave = {
	    			supportAgentName: self.selectedAgentName(),
	    			supportAgentId: self.selectedAgentId(),
	    			supportAgentColour: self.selectedAgentColour()
	    		};
	    		console.log(JSON.stringify(toSave));
	    		saveRequest.send(JSON.stringify(toSave));
	    		self.isLoading(true);
	    	}

	    	function RemoveDateRange(dateStart, dateEnd){
	    		//Do remove request!!!
	    		var deleteRequest = new XMLHttpRequest();
	    		deleteRequest.open('DELETE',window.Config.APIBaseUrl + 'schedule/range/?DateStart='+dateStart+'&DateEnd='+dateEnd,true);
	    		deleteRequest.setRequestHeader('Accept','application/json');
	    		deleteRequest.setRequestHeader('Authorization', userAccessKey);

	    		deleteRequest.onload = function () {
	    			if(this.status >= 200 && this.status < 400){
						self.errorMessages.push("Success: " + this.responseText);
	    				self.isSuccess(true);
	    			}
	    			else
	    			{
	    				self.errorMessages.push(this.responseText);
	    				self.isSuccess(false);
	    			}
	    		};

	    		deleteRequest.onerror = function () {

	    		};

	    		var toDelete = {
	    			supportAgentId: self.selectedAgentId()
	    		};
	    		
	    		deleteRequest.send(JSON.stringify(toDelete));
	    		self.isLoading(true);

	    	}

	    	self.agentSelectionChanged = function(agentId, agentName, agentColour) {
	    		self.selectedAgentId(agentId);
	    		self.selectedAgentName(agentName);
	    		self.selectedAgentColour(agentColour);
	    	};

	    	
	    	self.dateSelectionChanged = function(dates) {
	    		self.selectedDates(dates);
	    	};

	    	self.canSave = ko.computed(function() {
	    		return self.selectedDates().length > 0;
	    	});

	    	self.logout = function() {
	    		userAccessKey = "";
	    		self.isLoggedIn(false);
	    	};

	    	self.canLogin = function(login) {
	    		self.isLoggedIn(login);
	    	};

	    	self.addSelectedDates = function() {
	    		//Add Dates Here...
	    		self.selectedDates.sort( function(dateOne, dateTwo) { return dateOne.dateTime == dateTwo.dateTime ? 0 : (dateOne.dateTime < dateTwo.dateTime ? -1 : 1); });
	    		var startDate = moment(self.selectedDates()[0].dateTime).date() + "-" + (moment(self.selectedDates()[0].dateTime).month() + 1) + "-" + moment(self.selectedDates()[0].dateTime).year();
	    		var selectedLength = self.selectedDates().length;
	    		var endDate = moment(self.selectedDates()[selectedLength -1].dateTime).date() + "-" + (moment(self.selectedDates()[selectedLength -1].dateTime).month() + 1) + "-" + moment(self.selectedDates()[selectedLength - 1].dateTime).year();
	    		SaveDateRange(startDate,endDate);
	    		self.selectedDates([]);
	    		setTimeout(function() {
	    			self.isLoading(false);
	    		},500);

	    	};

	    	self.removeSelectedDates = function() {
    			self.selectedDates.sort( function(dateOne, dateTwo) { return dateOne.dateTime == dateTwo.dateTime ? 0 : (dateOne.dateTime < dateTwo.dateTime ? -1 : 1); });
    			var startDate = moment(self.selectedDates()[0].dateTime).date() + "-" + (moment(self.selectedDates()[0].dateTime).month() + 1) + "-" + moment(self.selectedDates()[0].dateTime).year();
	   			var selectedLength = self.selectedDates().length;
	   			var endDate = moment(self.selectedDates()[selectedLength -1].dateTime).date() + "-" + (moment(self.selectedDates()[selectedLength -1].dateTime).month() + 1) + "-" + moment(self.selectedDates()[selectedLength - 1].dateTime).year();
	    		RemoveDateRange(startDate,endDate);
	    		self.selectedDates([]);
	    		setTimeout(function() {
	    			self.isLoading(false);
	    		},500);

	    	};

	    	function GetInfo(){
	    		var getRequest = new XMLHttpRequest();
	    		getRequest.open('GET', window.Config.APIBaseUrl + '/info',true);
	    		getRequest.setRequestHeader('Accept', 'application/json');

	    		getRequest.onload = function(){
	    			if(this.status >= 200 && this.status < 400){
	    				var data = JSON.parse(this.response);
	    				console.log(data);
	    				self.ticketsActive(data.ticketsActive);
	    				self.ticketsNearSla(data.ticketsNearSla);
	    				self.currentlyOnCall(data.currentlyOnCall);
	    			} else {
	    				self.ticketsActive("--");
	    				self.ticketsNearSla("--");
	    				self.currentlyOnCall("Unknown");
	    			}
	    		};

	    		getRequest.onerror = function(){

	    		};

	    		getRequest.send();
	    	}
	    };
	}
);