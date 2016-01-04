define(['libs/knockout','./ContactMethods/ContactMethodEmail/ContactMethodEmail','./ContactMethods/ContactMethodPhone/ContactMethodPhone'], function SupportAgentEditViewModel(ko,EmailEditorViewModel,PhoneEditorViewModel) {

    ko.components.register('email-editor', {
        template: { require: 'text!components/SupportAgents/SupportAgentEditor/ContactMethods/ContactMethodEmail/ContactMethodEmail.html'}
    });

    ko.components.register('phone-editor', {
        template: { require: 'text!components/SupportAgents/SupportAgentEditor/ContactMethods/ContactMethodPhone/ContactMethodPhone.html'}
    });

    return function (params) {
        var self = this;

        self.isNew = ko.observable(true);
        self.currentId = ko.observable("");
        self.contactMethods = ko.observableArray([]);
        self.firstName = ko.observable("");
        self.lastName = ko.observable("");
        self.assignedColour = ko.observable();
        

        self.errorMessages = ko.observableArray([]);

        self.showErrors = ko.computed(function() {
            if(self.errorMessages().length > 0)
                return true;

            return false;
        });

        console.log("Support agent editor created with params:", params);
        if(params.id !== undefined)
        {
            self.isNew(false);
            //go get data from the server
            loadSupportAgent(params.id);
            self.currentId(params.id);
            var firstNameEle = document.getElementById("firstNameInput");
            var lastNameEle = document.getElementById("lastNameInput");
            var assignedColourEle = document.getElementById("assignedColourInput");
            firstNameEle.value = self.firstName;
            lastNameEle.value = self.lastName;
            assignedColourEle.value  = self.assignedColour;
        }

        self.addEmail = function() {
            var emailModel = new EmailEditorViewModel();
            self.contactMethods.push(emailModel);
        };

        self.addPhone = function() {
            var phoneModel = new PhoneEditorViewModel();
            phoneModel.type = "Phone";
            self.contactMethods.push(phoneModel);
        };

        self.addSms = function() {
            var smsModel = new PhoneEditorViewModel();
            smsModel.type = "Sms";
            self.contactMethods.push(smsModel);
        };

        self.removeContactMethod = function(method) {
            self.contactMethods.remove(method);
        };

        self.saveAgent = function(parent){
            console.log(parent);
            var saveRequest = new XMLHttpRequest();
            if(self.isNew()){
                saveRequest.open('POST', window.Config.APIBaseUrl + 'agents/', true);
                saveRequest.setRequestHeader('Content-Type', 'application/json'); 
                saveRequest.setRequestHeader('Authorization', userAccessKey);
            }
            else
            {
                saveRequest.open('PATCH', window.Config.APIBaseUrl + 'agents/' + self.currentId(), true);
                saveRequest.setRequestHeader('Content-Type', 'application/json');
                saveRequest.setRequestHeader('Authorization', userAccessKey);
            }
            
            saveRequest.onload = function() {
                if(this.status >= 200 && this.status < 400){
                    //Success!
                   parent.returnToList();
                }
                else
                {
                    self.errorMessages.push(this.responseText);
                    console.log(this.responseText);
                    console.log(this.response);
                    //Error!
                }

                
            };
            saveRequest.onerror = function() {
                //Error Handling.
                
            };
            console.log(self.assignedColour());
            var toSave = {
                contactMethods: ko.toJSON(self.contactMethods),
                firstName: self.firstName(),
                lastName: self.lastName(),
                assignedColour: self.assignedColour()
            };

            saveRequest.send(JSON.stringify(toSave));
        };

        self.hideAgent = function(parent){
            var hideRequest = new XMLHttpRequest();
            hideRequest.open('DELETE', window.Config.APIBaseUrl + 'agnets/hide/' + self.CurrentId(),true);
            hideRequest.setRequestHeader('Content-Type', 'application/json');
            hideRequest.setRequestHeader('Athorization', userAccessKey);

            hideRequest.onload = function() {
                if(this.status >= 200 && this.status < 400){
                    parent.returnToList();
                }
                else
                {
                    self.errorMessage.push(this.responseText);
                }
            };

            hideRequest.onerror = function(){
                //Error Handling.
            };

            hideRequest.send('');
        };
        function loadSupportAgent(id){
            var  request = new XMLHttpRequest();
            request.open('GET', window.Config.APIBaseUrl + 'agents/' + id, true);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Authorization', userAccessKey);
            request.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var data = JSON.parse(this.response);
                    self.firstName(data.firstName);
                    self.lastName(data.lastName);
                    self.contactMethods(data.contactMethods);
                    self.assignedColour(data.assignedColour);
                } else {
                    // We reached our target server, but it returned an error
                    self.errorMessages.push(this.responseText);
                }
            };

            request.onerror = function() {
                // There was a connection error of some sort
            };

            request.send();
        }
    };
});