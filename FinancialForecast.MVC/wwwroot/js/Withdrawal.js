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

var WithdrawalsController = new Vue({
    el: "#Withdrawals",
    data: {
        errorMessage: false,
        alertMessage: '',
        ascending: false,
        sortColumn: '',
        //WithdrawalCount: 0,
        //startRange: 0,
        //endRange: 0,
        query: '',
        filtering : false,
        filteredWithdrawals : [],
        selectedWithdrawal: null,
        selectedWithdrawalID: '',
        Withdrawals: [],        
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
            if (this.Withdrawals.length === 0) {
                axios.get(baseURL + 'api/Withdrawals/getWithdrawalColumns').then(function (response) {
                    try {
                        console.log(Object.keys(response.data));
                        return Object.keys(response.data);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }.bind(this))
                    .catch(function (error) {
                        WithdrawalsController.alertErrorMessage(error.response.data);
                        console.log(error);
                    });
            }
            else {
                return Object.keys(this.Withdrawals[0]);
            }
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/Withdrawals/getWithdrawalsWithinRange/' + this.startDate + '/' + this.endDate).then(function (response) {
            try {
                this.Withdrawals = response.data;
                console.log(this.Withdrawals);
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error);
            });


    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            WithdrawalsController.errorMessage = false;
            WithdrawalsController.alertMessage = text;
            setTimeout(function () { WithdrawalsController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            WithdrawalsController.errorMessage = true;
            WithdrawalsController.alertMessage = text;
            setTimeout(function () { WithdrawalsController.alertMessage = '' }, 3000);
        },
        "filterText": function filterText(query) {
            this.selectedWithdrawal = null;
            this.selectedWithdrawalID = null;

            if (query === '') {
                this.filtering = false;
                this.filteredWithdrawals = [];
                //this.resortTable();
                return;
            }
            else {
                this.filtering = true;
                this.filteredWithdrawals = this.Withdrawals.filter(function (items) {
                    for (var item in items) {
                        if (item !== "ID") {
                            if (String(items[item]).toUpperCase().indexOf(query.toUpperCase()) !== -1) {
                                return true;
                            }
                        }
                    }
                    return false;
                }.bind(this));
                //this.setfilteredWithdrawals(this.filteredWithdrawals);
                //this.resortTable();
            }
        },
        "getWithdrawals": function getWithdrawals() {         
            if (this.filteredWithdrawals.length > 0 && this.filtering === true) {
                //this.coilCount = this.filteredCoils.length;
                return this.filteredWithdrawals;
            }
            else if (this.filteredWithdrawals.length === 0 && this.filtering === true) {
                return [];
            }
            else {
                this.filteredWithdrawals = this.Withdrawals;
                return this.Withdrawals;
            }
        },
        "openCreateModal": function openCreateModal() {
            CreateModalController.openCreateModal();
        },
        "openEditModal": function openEditModal() {
            if (this.selectedWithdrawal !== null)
                EditModalController.openEditModal(this.selectedWithdrawal);
        },
        "openMultipleEditModal": function openEditModal() {
            if (this.selectedWithdrawal !== null)
                MultipleEditModalController.openMultipleEditModal(this.selectedWithdrawal);
        },
        "openMultipleDeleteModal": function openMultipleDeleteModal() {
            if (this.selectedWithdrawal !== null)
                MultipleDeleteModalController.openMultipleDeleteModal(this.selectedWithdrawal);
        },
        "refreshTable": function refreshTable() {
            if (this.SelectedDateID == 5) {
                axios.get(baseURL + 'api/Withdrawals/all').then(function (response) {
                    try {
                        this.Withdrawals = response.data;
                        this.filteredWithdrawals = response.data;
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
                axios.get(baseURL + 'api/Withdrawals/getWithdrawalsWithinRange/' + this.startDate + '/' + this.endDate).then(function (response) {
                    try {
                        this.Withdrawals = response.data;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }

            this.selectedWithdrawal = null;
            this.selectedWithdrawalID = '';

        },

        "resetAlertMessage": function resetAlertMessage() {
            WithdrawalsController.errorMessage = false;
            WithdrawalsController.alertMessage = '';
        },
        "resortTable": function resortTable() {
            col = this.sortColumn;
            var ascending = this.ascending;
            //this.currentPage = 1;
            this.filteredWithdrawals.sort(function (a, b) {
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
            this.filteredWithdrawals.sort(function (a, b) {
                if (a[col] > b[col]) {
                    return ascending ? 1 : -1;
                } else if (a[col] < b[col]) {
                    return ascending ? -1 : 1;
                }

                return 0;
            });
        },
        "WithdrawalClicked": function WithdrawalClicked(Withdrawal) {
            this.selectedWithdrawalID = Withdrawal.id;
            this.selectedWithdrawal = Withdrawal;
            console.log(Withdrawal);
        }
    },
    watch: {
        SelectedDateID: function (value) {
            serverBus.$emit('dateSelected', this.SelectedDateID);
        }
    }
});

var CreateModalController = new Vue({
    el: "#WithdrawalCreateModal",
    data: {
        Withdrawal: {}
    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.Withdrawal = {}
            this.Withdrawal.Date = new Date().toISOString().slice(0, 10);
            var date = new Date();
            this.Withdrawal['Stop Date'] = date.addDays(365).toISOString().slice(0,10);
            
            console.log(this.Withdrawal);            
        },
        "createNewWithdrawal": function createNewWithdrawal() {
            console.log(this.Withdrawal);
            axios.post(baseURL + 'api/Withdrawals/new', this.Withdrawal).then(function (response) {
                try {
                    console.log("Withdrawal was successfully added");
                    WithdrawalsController.alertSuccessMessage("Withdrawal was successfully added");
                    WithdrawalsController.refreshTable();
                }
                catch (error) {
                    WithdrawalsController.refreshTable();
                    WithdrawalsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                WithdrawalsController.refreshTable();
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            WithdrawalsController.refreshTable();
            this.Withdrawal = [];
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
                        CreateModalController.createNewWithdrawal();
                        $('#WithdrawalCreateModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#WithdrawalCreateModal").submit(function (event) {
            event.preventDefault();
        });
    }
});

var EditModalController = new Vue({
    el: "#WithdrawalEditModal",
    data: {
        editedWithdrawal: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openEditModal": function openEditModal(Withdrawal) {
            console.log(Withdrawal);
            this.editedWithdrawal = Withdrawal;
        },
        "editSelectedWithdrawal": function editSelectedWithdrawal() {
            axios.post(baseURL + 'api/Withdrawals/edit/' + WithdrawalsController.selectedWithdrawalID, this.editedWithdrawal).then(function (response) {
                try {
                    WithdrawalsController.alertSuccessMessage("Changes were successful");
                    WithdrawalsController.refreshTable();
                }
                catch (error) {
                    WithdrawalsController.refreshTable();
                    WithdrawalsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                WithdrawalsController.refreshTable();
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            WithdrawalsController.refreshTable();
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
                        EditModalController.editSelectedWithdrawal();
                        $('#WithdrawalEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#WithdrawalEditModal").submit(function (event) {
            event.preventDefault();
        });


    }
});

var MultipleEditModalController = new Vue({
    el: "#WithdrawalMultipleEditModal",
    data: {
        editedWithdrawal: {},
        recurringWithdrawals: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openMultipleEditModal": function openMultipleEditModal(Withdrawal) {
            
            this.editedWithdrawal = Withdrawal;
            console.log(this.editedWithdrawal);

            axios.get(baseURL + 'api/Withdrawals/getRecurringWithdrawals/' + WithdrawalsController.selectedWithdrawalID, Withdrawal).then(function (response) {
                try {
                    this.recurringWithdrawals = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#WithdrawalMultipleEditModal").submit(function (event) {
                event.preventDefault();
            });
        },
        "MultipleEditSelectedWithdrawal": function MultipleEditSelectedWithdrawal() {
            axios.post(baseURL + 'api/Withdrawals/multipleEdits/' + WithdrawalsController.selectedWithdrawalID, this.editedWithdrawal, this.recurringWithdrawals).then(function (response) {
                try {
                    WithdrawalsController.alertSuccessMessage("Changes were successful");
                    WithdrawalsController.refreshTable();
                }
                catch (error) {
                    WithdrawalsController.refreshTable();
                    WithdrawalsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                WithdrawalsController.refreshTable();
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "RemoveItem": function RemoveItem(Withdrawal) {

        },
        "resetForm": function resetForm() {
            WithdrawalsController.refreshTable();
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
                        MultipleEditModalController.MultipleEditSelectedWithdrawal();
                        $('#WithdrawalMultipleEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);


    },
    computed: {
        "columns": function columns() {
            if (WithdrawalsController.Withdrawals.length === 0) {
                return [];
            }
            return Object.keys(WithdrawalsController.Withdrawals[0]);
        }
    }
});


var DeleteModalController = new Vue({
    el: "#WithdrawalDeletionConfirmation",
    methods: {
        "deleteWithdrawal": function deleteWithdrawal() {
            axios.post(baseURL + 'api/Withdrawals/deleteWithdrawal/' + WithdrawalsController.selectedWithdrawalID).then(function (response) {
                try {
                    WithdrawalsController.alertSuccessMessage("Changes were successful");
                    WithdrawalsController.refreshTable();
                }
                catch (error) {
                    WithdrawalsController.refreshTable();
                    WithdrawalsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                WithdrawalsController.refreshTable();
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    }
});

var MultipleDeleteModalController = new Vue({
    el: "#multipleWithdrawalDeletionConfirmation",
    data: {
        recurringWithdrawals: {}
    },
    methods: {
        "openMultipleDeleteModal": function openMultipleDeleteModal(Withdrawal) {
            console.log(this.Withdrawal);

            axios.get(baseURL + 'api/Withdrawals/getRecurringWithdrawals/' + WithdrawalsController.selectedWithdrawalID, Withdrawal).then(function (response) {
                try {
                    this.recurringWithdrawals = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#multipleWithdrawalDeletionConfirmation").submit(function (event) {
                event.preventDefault();
            });
        },
        "deleteMultipleWithdrawals": function deleteMultipleWithdrawals() {
            axios.post(baseURL + 'api/Withdrawals/deleteMultipleWithdrawals/' + WithdrawalsController.selectedWithdrawalID).then(function (response) {
                try {
                    WithdrawalsController.alertSuccessMessage("Changes were successful");
                    WithdrawalsController.refreshTable();
                }
                catch (error) {
                    WithdrawalsController.refreshTable();
                    WithdrawalsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                WithdrawalsController.refreshTable();
                WithdrawalsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    },
    computed: {
        "columns": function columns() {
            if (WithdrawalsController.Withdrawals.length === 0) {
                return [];
            }
            return Object.keys(WithdrawalsController.Withdrawals[0]);
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

        WithdrawalsController.startDate = new Date().toISOString().slice(0, 10);
        WithdrawalsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 6 Months
    else if (selectedDateID === 2) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate(), 23, 59, 59, 0);

        WithdrawalsController.startDate = new Date().toISOString().slice(0, 10);
        WithdrawalsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 9 Months
    else if (selectedDateID === 3) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 9, today.getDate(), 23, 59, 59, 0);

        WithdrawalsController.startDate = new Date().toISOString().slice(0, 10);
        WithdrawalsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 12 Months
    else if (selectedDateID === 4) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear()+1, today.getMonth(), today.getDate(), 23, 59, 59, 0);

        WithdrawalsController.startDate = new Date().toISOString().slice(0, 10);
        WithdrawalsController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //All
    else if (selectedDateID === 5) {
    }

    WithdrawalsController.refreshTable();
    WithdrawalsController.filtering = false;
    WithdrawalsController.query = '';
};

serverBus.$on('dateSelected', dateHandler);