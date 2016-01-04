define(['libs/knockout'], function SupportAgentListViewModel(ko) {
    return function(params) {
        var self = this;
        console.log("Support Agent List Params:", params);
        self.agentSelectionChanged = params.selectedCallback || function() {};
        self.supportAgents = ko.observableArray([]);
        self.selectedAgentId = ko.observable("");
        self.selectedAgentColour = ko.observable("");

        function LoadAllSupportAgents(){
            var  request = new XMLHttpRequest();
            request.open('GET', window.Config.APIBaseUrl + 'agents/', true);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Authorization', userAccessKey);
            request.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var data = JSON.parse(this.response);
                    self.supportAgents(data);


                } else {
                    // We reached our target server, but it returned an error
                }
            };

            request.onerror = function() {
                // There was a connection error of some sort
            };

            request.send();
        }

        self.agentClicked = function(agentObject) {
            if(agentObject.id === self.selectedAgentId()) {
                self.agentSelectionChanged(undefined,undefined,undefined);
                self.selectedAgentId(undefined);
                self.selectedAgentColour(undefined);
                console.log(agentObject);
            } else {
                self.agentSelectionChanged(agentObject.id,agentObject.firstName + " " + agentObject.lastName,agentObject.assignedColour);
                self.selectedAgentId(agentObject.id);
                self.selectedAgentColour(agentObject.assignedColour);
                console.log(agentObject);
            }
        };

        self.addAgent = function (agentObject) {
            self.supportAgents.push(agentObject);
        };

        LoadAllSupportAgents();
    };

});