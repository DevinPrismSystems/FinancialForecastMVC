axios.defaults.baseURL = baseURL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.headers.common = {
    "Content-Type": "application/json"
}
var today = new Date()
var initialEndDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate(), 23,59,59,0)
const serverBus = new Vue();

var DepositsController = new Vue({
    el: "#Deposits",
    data: {
        errorMessage: false,
        alertMessage: '',
        ascending: false,
        sortColumn: '',
        //DepositCount: 0,
        //startRange: 0,
        //endRange: 0,
        query: '',
        filtering : false,
        filteredDeposits : [],
        selectedDeposit: null,
        selectedDepositID: '',
        Deposits: [],        
        startDate: new Date().toISOString().slice(0, 10),
        endDate: initialEndDate.toISOString().slice(0,10),
        SelectedDateID: 1,
        options: [{
            id: 1, text: 'Next 3 Months'
        },
        {
            id: 2, text: 'Next 6 Months'
        },
        {
            id: 3, text: 'Next 9 Months'
        },
        {            
            id: 4, text: 'Next 12 Months'
        },
        {
            id: 5, text: 'All'
        }]
    },
    computed: {
        "columns": function columns() {
            if (this.Deposits.length === 0) {
                axios.get(baseURL + 'api/deposits/getDepositColumns').then(function (response) {
                    try {
                        return Object.keys(response.data);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }.bind(this))
                    .catch(function (error) {
                        DepositsController.alertErrorMessage(error.response.data);
                        console.log(error);
                    });
            }
            else {
                return Object.keys(this.Deposits[0]);
            }
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/Deposits/getDepositsWithinRange/' + this.startDate + '/' + this.endDate).then(function (response) {
            try {
                this.Deposits = response.data;
                console.log(this.Deposits);
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });


    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            DepositsController.errorMessage = false;
            DepositsController.alertMessage = text;
            setTimeout(function () { DepositsController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            DepositsController.errorMessage = true;
            DepositsController.alertMessage = text;
            setTimeout(function () { DepositsController.alertMessage = '' }, 3000);
        },
        "filterText": function filterText(query) {
            this.selectedDeposit = null;
            this.selectedDepositID = null;

            if (query === '') {
                this.filtering = false;
                this.filteredDeposits = [];
                //this.resortTable();
                return;
            }
            else {
                this.filtering = true;
                this.filteredDeposits = this.Deposits.filter(function (items) {
                    for (var item in items) {
                        if (item !== "ID") {
                            if (String(items[item]).toUpperCase().indexOf(query.toUpperCase()) !== -1) {
                                return true;
                            }
                        }
                    }
                    return false;
                }.bind(this));
                //this.setfilteredDeposits(this.filteredDeposits);
                //this.resortTable();
            }
        },
        "getDeposits": function getDeposits() {         
            if (this.filteredDeposits.length > 0 && this.filtering === true) {
                //this.coilCount = this.filteredCoils.length;
                return this.filteredDeposits;
            }
            else if (this.filteredDeposits.length === 0 && this.filtering === true) {
                return [];
            }
            else {
                this.filteredDeposits = this.Deposits;
                return this.Deposits;
            }
        },
        "openCreateModal": function openCreateModal() {
            CreateModalController.openCreateModal();
        },
        "openEditModal": function openEditModal() {
            if (this.selectedDeposit !== null)
                EditModalController.openEditModal(this.selectedDeposit);
        },
        "openMultipleEditModal": function openEditModal() {
            if (this.selectedDeposit !== null)
                MultipleEditModalController.openMultipleEditModal(this.selectedDeposit);
        },
        "openMultipleDeleteModal": function openMultipleDeleteModal() {
            if (this.selectedDeposit !== null)
                MultipleDeleteModalController.openMultipleDeleteModal(this.selectedDeposit);
        },
        "refreshTable": function refreshTable() {
            if (this.SelectedDateID == 5) {
                axios.get(baseURL + 'api/Deposits/all').then(function (response) {
                    try {
                        this.Deposits = response.data;
                        this.filteredDeposits = response.data;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            else {
                axios.get(baseURL + 'api/Deposits/getDepositsWithinRange/' + this.startDate + '/' + this.endDate).then(function (response) {
                    try {
                        this.Deposits = response.data;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }

            this.selectedDeposit = null;
            this.selectedDepositID = '';

        },

        "resetAlertMessage": function resetAlertMessage() {
            DepositsController.errorMessage = false;
            DepositsController.alertMessage = '';
        },
        "resortTable": function resortTable() {
            col = this.sortColumn;
            var ascending = this.ascending;
            //this.currentPage = 1;
            this.filteredDeposits.sort(function (a, b) {
                if (a[col] > b[col]) {
                    return ascending ? 1 : -1;
                } else if (a[col] < b[col]) {
                    return ascending ? -1 : 1;
                }
                return 0;
            });
        },
        "sortTable": function sortTable(col) {
            if (this.sortColumn === col) {
                this.ascending = !this.ascending;
            }
            else {
                this.ascending = true;
                this.sortColumn = col;
            }

            var ascending = this.ascending;            
            //this.currentPage = 1;
            this.filteredDeposits.sort(function (a, b) {
                if (a[col] > b[col]) {
                    return ascending ? 1 : -1;
                } else if (a[col] < b[col]) {
                    return ascending ? -1 : 1;
                }

                return 0;
            });
        },
        "DepositClicked": function DepositClicked(Deposit) {
            this.selectedDepositID = Deposit.id;
            this.selectedDeposit = Deposit;
            console.log(Deposit);
        }
    },
    watch: {
        SelectedDateID: function (value) {
            serverBus.$emit('dateSelected', this.SelectedDateID);
        }
    }
});

var CreateModalController = new Vue({
    el: "#DepositCreateModal",
    data: {
        Deposit: {}
    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.Deposit = {}
            this.Deposit.Date = new Date().toISOString().slice(0, 10);
            var date = new Date();
            this.Deposit['Stop Date'] = date.addDays(365).toISOString().slice(0,10);
            
            console.log(this.Deposit);            
        },
        "createNewDeposit": function createNewDeposit() {
            console.log(this.Deposit);
            axios.post(baseURL + 'api/deposits/new', this.Deposit).then(function (response) {
                try {
                    console.log("Deposit was successfully added");
                    DepositsController.alertSuccessMessage("Deposit was successfully added");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            DepositsController.refreshTable();
            this.Deposit = [];
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('create-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                    else {
                        form.classList.add('was-validated');
                        CreateModalController.createNewDeposit();
                        $('#DepositCreateModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#DepositCreateModal").submit(function (event) {
            event.preventDefault();
        });
    }
});

var EditModalController = new Vue({
    el: "#DepositEditModal",
    data: {
        editedDeposit: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openEditModal": function openEditModal(Deposit) {
            console.log(Deposit);
            this.editedDeposit = Deposit;
        },
        "editSelectedDeposit": function editSelectedDeposit() {
            axios.post(baseURL + 'api/Deposits/edit/' + DepositsController.selectedDepositID, this.editedDeposit).then(function (response) {
                try {
                    DepositsController.alertSuccessMessage("Changes were successful");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            DepositsController.refreshTable();
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('edit-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                    else {
                        form.classList.add('was-validated');
                        EditModalController.editSelectedDeposit();
                        $('#DepositEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#DepositEditModal").submit(function (event) {
            event.preventDefault();
        });


    }
});

var MultipleEditModalController = new Vue({
    el: "#DepositMultipleEditModal",
    data: {
        editedDeposit: {},
        recurringDeposits: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openMultipleEditModal": function openMultipleEditModal(Deposit) {
            
            this.editedDeposit = Deposit;
            console.log(this.editedDeposit);

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + DepositsController.selectedDepositID, Deposit).then(function (response) {
                try {
                    this.recurringDeposits = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#DepositMultipleEditModal").submit(function (event) {
                event.preventDefault();
            });
        },
        "MultipleEditSelectedDeposit": function MultipleEditSelectedDeposit() {
            axios.post(baseURL + 'api/Deposits/multipleEdits/' + DepositsController.selectedDepositID, this.editedDeposit, this.recurringDeposits).then(function (response) {
                try {
                    DepositsController.alertSuccessMessage("Changes were successful");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "RemoveItem": function RemoveItem(Deposit) {
            index = this.recurringDeposits.findIndex(x => x.id === Deposit.id);
            this.recurringDeposits.splice(index, 1);
        },
        "resetForm": function resetForm() {
            DepositsController.refreshTable();
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('multipleEdit-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                    else {
                        form.classList.add('was-validated');
                        MultipleEditModalController.MultipleEditSelectedDeposit();
                        $('#DepositMultipleEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);


    },
    computed: {
        "columns": function columns() {
            if (DepositsController.Deposits.length === 0) {
                return [];
            }
            return Object.keys(DepositsController.Deposits[0]);
        }
    }
});


var DeleteModalController = new Vue({
    el: "#depositDeletionConfirmation",
    methods: {
        "deleteDeposit": function deleteDeposit() {
            axios.post(baseURL + 'api/deposits/deleteDeposit/' + DepositsController.selectedDepositID).then(function (response) {
                try {
                    DepositsController.alertSuccessMessage("Changes were successful");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    }
});

var MultipleDeleteModalController = new Vue({
    el: "#multipleDepositDeletionConfirmation",
    data: {
        recurringDeposits: {}
    },
    methods: {
        "openMultipleDeleteModal": function openMultipleDeleteModal(Deposit) {

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + DepositsController.selectedDepositID, Deposit).then(function (response) {
                try {
                    this.recurringDeposits = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#multipleDepositDeletionConfirmation").submit(function (event) {
                event.preventDefault();
            });
        },
        "deleteMultipleDeposits": function deleteMultipleDeposits() {
            axios.post(baseURL + 'api/deposits/deleteMultipleDeposits/' + DepositsController.selectedDepositID).then(function (response) {
                try {
                    DepositsController.alertSuccessMessage("Changes were successful");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "RemoveItem": function RemoveItem(Deposit) {
            index = this.recurringDeposits.findIndex(x => x.id === Deposit.id);
            this.recurringDeposits.splice(index, 1);
        }
    },
    computed: {
        "columns": function columns() {
            if (DepositsController.Deposits.length === 0) {
                return [];
            }
            return Object.keys(DepositsController.Deposits[0]);
        }
    }
});

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const dateHandler = function (selectedDateID) {
    //Next 3 Months
    if (selectedDateID === 1) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth()+3, today.getDate(), 23, 59, 59, 0);

        DepositsController.startDate = new Date().toISOString().slice(0, 10);
        DepositsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 6 Months
    else if (selectedDateID === 2) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate(), 23, 59, 59, 0);

        DepositsController.startDate = new Date().toISOString().slice(0, 10);
        DepositsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 9 Months
    else if (selectedDateID === 3) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 9, today.getDate(), 23, 59, 59, 0);

        DepositsController.startDate = new Date().toISOString().slice(0, 10);
        DepositsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 12 Months
    else if (selectedDateID === 4) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear()+1, today.getMonth(), today.getDate(), 23, 59, 59, 0);

        DepositsController.startDate = new Date().toISOString().slice(0, 10);
        DepositsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //All
    else if (selectedDateID === 5) {
    }

    DepositsController.refreshTable();
    DepositsController.filtering = false;
    DepositsController.query = '';
};

serverBus.$on('dateSelected', dateHandler);