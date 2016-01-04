define(
	['libs/knockout','./CalendarView/CalendarView'],
	 function(ko,CalendarViewModel) {

		ko.components.register('calendar-view', {
			viewModel: { require: 'components/Calendar/CalendarView/CalendarView'},
			template: { require: 'text!components/Calendar/CalendarView/CalendarView.html'}
		});

		return function(params) {
			var self = this;
			self.dateSelectionChanged = params.selectedCallback || function() {};
		};
	});