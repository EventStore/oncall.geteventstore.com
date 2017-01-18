define(["libs/knockout"],function(a){return function(b){function c(){""!==window.Config.lastDate&&(dateCurrent=moment(window.Config.lastDate),d.currentDate(dateCurrent)),d.currentTitleDisplay(d.currentDate().format("MMMM")+" "+d.currentDate().format("YYYY"));var a=d.currentDate().month()+1,b=d.currentDate().year(),c="01-"+a+"-"+b,e=moment(a+"-"+b,"MM-YYYY").daysInMonth(),f=e+"-"+a+"-"+b,g=new XMLHttpRequest;g.open("GET",window.Config.APIBaseUrl+"schedule/range/?DateStart="+c+"&DateEnd="+f,!0),g.setRequestHeader("Accept","application/json"),g.setRequestHeader("Authorization",userAccessKey),g.onload=function(){if(this.status>=200&&this.status<400){var a=JSON.parse(this.response);d.currentDates(a);var b=moment(d.currentDates()[0].dateTime).day(),c=b-1;for(-1==c&&(c=6),d.disabledBlocksStart([]),i=0;i<c;i++)d.disabledBlocksStart.push("");var e=moment(d.currentDates()[d.currentDates().length-1].dateTime).day();for(d.disabledBlocksEnd([]),c=7-e,7==c&&(c=0),i=0;i<c;i++)d.disabledBlocksEnd.push("")}else d.calendarErrors.push("Error "+this.status+": "+this.responseText)},g.onerror=function(){},g.send()}var d=this;d.currentTitleDisplay=a.observable(""),d.currentDates=a.observableArray([]),d.startDateCapture=a.observableArray([]),d.disabledBlocksStart=a.observableArray([]),d.disabledBlocksEnd=a.observableArray([]),d.dateSelectionChanged=b.selectedCallback||function(){},d.currentRowLength=a.observable(0),d.selectedDates=a.observableArray([]),d.addRemoveSuccess=a.observable(!1),d.addRemoveSuccessMessage=a.observable(""),d.selectedFirstDate=a.observable(!1),d.currentDate=a.observable(moment()),d.currentDay=a.observable(moment().date()),d.calendarErrors=a.observableArray([]),d.showErrors=a.computed(function(){return d.calendarErrors()>0?!0:!1}),d.isDateBeforeToday=function(a){if(moment(a).year()<=moment().year()){if(moment(a).month()<=moment().month())return!0;if(moment(a).date()<moment().date())return!0}return!1},d.isDateToday=function(a){return moment(a).year()===moment().year()&&moment(a).month()===moment().month()&&moment(a).date()===moment().date()?!0:!1},d.clearSelectedDates=function(){d.selectedDates([])},d.savedDates=function(){d.selectedDates([]),d.addRemoveSuccessMessage("Successfully saved the selected dates."),d.addRemoveSuccess(!0)},d.removedDates=function(){d.selectedDates([]),d.addRemoveSuccessMessage("Successfully removed the selected dates."),d.addRemoveSuccess(!0)},d.messageDismissed=function(){d.addRemoveSuccess(!1)},d.nextMonth=function(){d.selectedDates([]),d.currentDate().add(1,"months"),window.Config.lastDate=moment(d.currentDate()).format(),c()},d.prevMonth=function(){d.selectedDates([]),d.currentDate().subtract(1,"months"),window.Config.lastDate=moment(d.currentDate()).format(),c()},d.selectDate=function(a){if(d.selectedFirstDate()===!1)d.selectedDates([]),d.selectedDates.push(a),d.selectedFirstDate(!0);else{var b=moment(d.selectedDates()[0].dateTime).date(),c=moment(a.dateTime).date();if(c>=b)for(i=b;i<c;i++)d.selectedDates.push(d.currentDates()[i]);else for(i=c;i<b;i++)d.selectedDates.push(d.currentDates()[i-1]);d.selectedFirstDate(!1),d.dateSelectionChanged(d.selectedDates())}},c()}});