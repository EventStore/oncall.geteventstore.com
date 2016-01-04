define(["libs/knockout"], function CalendarViewModel(ko) {
	return function(params) {
		var self = this;

		self.currentTitleDisplay = ko.observable("");
		self.currentDates = ko.observableArray([]);
		self.startDateCapture = ko.observableArray([]);
		self.disabledBlocksStart = ko.observableArray([]);
		self.disabledBlocksEnd = ko.observableArray([]);

		self.dateSelectionChanged = params.selectedCallback || function() {};

		self.currentRowLength = ko.observable(0);
		self.selectedDates = ko.observableArray([]);
		self.addRemoveSuccess = ko.observable(false);
		self.addRemoveSuccessMessage = ko.observable("");
		self.selectedFirstDate = ko.observable(false);

		self.currentDate = ko.observable(moment());
		self.currentDay = ko.observable(moment().date());

		self.calendarErrors = ko.observableArray([]);

		self.showErrors = ko.computed(function() {
			if(self.calendarErrors() > 0)
				return true;
			return false;
		});
		
		function GetCalendarData(){
			//Detect the month and generate the correct amount of days...
			if(window.Config.lastDate !== "")
			{
				dateCurrent =  moment(window.Config.lastDate);
				self.currentDate(dateCurrent);
			}
			self.currentTitleDisplay(self.currentDate().format("MMMM") +" " + self.currentDate().format("YYYY"));

			var month = self.currentDate().month() + 1;
			var year = self.currentDate().year();

			var dateStart = "01-" + month + "-" + year;
			var endDay = moment(month + "-" + year, "MM-YYYY").daysInMonth();
			var dateEnd = endDay + "-" + month + "-" + year;

			//Process the date range.
			var request = new XMLHttpRequest();
			request.open('GET',window.Config.APIBaseUrl + 'schedule/range/?DateStart='+dateStart+'&DateEnd='+dateEnd, true);
			request.setRequestHeader('Accept', 'application/json');
			request.setRequestHeader('Authorization', userAccessKey);
			request.onload = function (){
				if (this.status >= 200 && this.status < 400){
					var data = JSON.parse(this.response);
					self.currentDates(data);
					var firstDay = moment(self.currentDates()[0].dateTime).day();
					//console.log(window.Config.APIBaseUrl + 'schedule/range/?DateStart='+dateStart+'&DateEnd='+dateEnd);
					//sunday = 0 - add 6
					//monday = 1 - add 0 days
					//tuesdat = 2 - add 1 day]
					//weds = 3 add 2 days
					//thurs = 4 add 3 days
					//fri = 5 add 4 days
					//sat = 6 add 5 days
					var daysToAdd = firstDay - 1;
					if(daysToAdd == -1)
						daysToAdd = 6;

					self.disabledBlocksStart([]);
					for (i = 0;i < daysToAdd; i++){
						self.disabledBlocksStart.push("");
					}

					var lastDay = moment(self.currentDates()[self.currentDates().length - 1].dateTime).day();
					self.disabledBlocksEnd([]);
					daysToAdd = 7 - lastDay;

					if(daysToAdd == 7)
						daysToAdd = 0;

					for (i = 0;i < daysToAdd; i++){
						self.disabledBlocksEnd.push("");
					}

				} else {
					//Server reached but error caused.
					self.calendarErrors.push("Error " + this.status + ": " + this.responseText);
				}

			};

			request.onerror = function () {
				//Error, Error, Error... Do Something here...
			};

			request.send();
		}

		self.isDateBeforeToday = function(dateChecking){
			if(moment(dateChecking).year() <= moment().year()){
				if(moment(dateChecking).month() <= moment().month()){
					return true;
				}
				if(moment(dateChecking).date() < moment().date()){
					return true;
				}
			}

			return false;
		};

		self.isDateToday = function (dateChecking){
			if(moment(dateChecking).year() === moment().year() && moment(dateChecking).month() === moment().month() && moment(dateChecking).date() === moment().date()){
				return true;
			}
			return false;
		};

		self.clearSelectedDates = function (){
			self.selectedDates([]);
		};

		self.savedDates = function (){
			self.selectedDates([]);
			self.addRemoveSuccessMessage("Successfully saved the selected dates.");
			self.addRemoveSuccess(true);
		};

		self.removedDates = function (){
			self.selectedDates([]);
			self.addRemoveSuccessMessage("Successfully removed the selected dates.");
			self.addRemoveSuccess(true);
		};

		self.messageDismissed = function(){
			self.addRemoveSuccess(false);
		};

		self.nextMonth = function(){
			self.selectedDates([]);
			self.currentDate().add(1,'months');
			window.Config.lastDate = moment(self.currentDate()).format();
			GetCalendarData();
		};
		
		self.prevMonth = function(){
			self.selectedDates([]);
			self.currentDate().subtract(1,'months');
			window.Config.lastDate = moment(self.currentDate()).format();
			GetCalendarData();
		};

		self.selectDate = function(dateClicked){
			if(self.selectedFirstDate() === false){
				self.selectedDates([]);
				self.selectedDates.push(dateClicked);
				self.selectedFirstDate(true);
			} else {
				var firstSelectedDay = moment(self.selectedDates()[0].dateTime).date();
				var lastSelectedDay = moment(dateClicked.dateTime).date();

				if (firstSelectedDay <= lastSelectedDay){
					for(i = firstSelectedDay; i < lastSelectedDay; i++){
						self.selectedDates.push(self.currentDates()[i]);
					}
				} else {
					for(i = lastSelectedDay; i < firstSelectedDay; i++){
						self.selectedDates.push(self.currentDates()[i - 1]);
					}
				}
				self.selectedFirstDate(false);
				self.dateSelectionChanged(self.selectedDates());
			}


			/*if(self.selectedDates.indexOf(dateClicked) === -1){
				self.selectedDates.push(dateClicked);
			}
			else {
				self.selectedDates.remove(dateClicked);
			}
			self.dateSelectionChanged(self.selectedDates());*/
		};

		
		GetCalendarData();
	};
});