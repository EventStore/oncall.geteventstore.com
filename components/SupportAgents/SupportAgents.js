define(
    ['libs/knockout','./SupportAgentEditor/SupportAgentEditor','./SupportAgentList/SupportAgentList'], 
    function(ko, SupportAgentEditViewModel, SupportAgentListViewModel) {
        
        ko.components.register('support-agent-list', {
            viewModel: { require: 'components/SupportAgents/SupportAgentList/SupportAgentList' },
            template: { require: 'text!components/SupportAgents/SupportAgentList/SupportAgentList.html' }
        });

        ko.components.register('support-agent-editor', {
            viewModel: { require: 'components/SupportAgents/SupportAgentEditor/SupportAgentEditor' },
            template: { require: 'text!components/SupportAgents/SupportAgentEditor/SupportAgentEditor.html' }
        });

        return function(params) {
            var self = this;

            console.log("Support Agent Area Params:", params);
            self.agentSelectionChanged = params.selectedCallback || function() {};
            console.log(self.selectionChangedCallback);
            self.isEditing = ko.observable(false);
            self.editId = ko.observable();
            
            self.new = function() {
                self.editId(undefined);
                self.isEditing(true);
            };

            self.edit = function(toEdit) {
                self.editId(toEdit.id);
                self.isEditing(true);
            };

            self.returnToList = function() {
                self.editId(undefined);
                self.isEditing(false);
            };
        };
});