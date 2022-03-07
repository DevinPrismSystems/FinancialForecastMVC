axios.defaults.baseURL = baseURL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.headers.common = {
    "Content-Type": "application/json"
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

var today = new Date()
var initialEndDate = new Date(today.addDays(14));
const serverBus = new Vue();

var ForecastController = new Vue({
    el: "#Forecast",
    data: {
        errorMessage: false,
        alertMessage: '',
        todaysAmount: 0,
        //DepositCount: 0,
        //startRange: 0,
        //endRange: 0,
        selectedItem: null,
        selectedItemID: '',
        financialItemKeys: [],
        Deposits: [],
        Withdrawals: [],
        ForecastedItems: [],
        startDate: new Date().toISOString().slice(0, 10),
        endDate: initialEndDate.toISOString().slice(0, 10),
        SelectedDateID: 1,
        options: [{
            id: 1, text: 'Next Two Weeks'
        },
        {
            id: 2, text: 'This Month'
        },
        {
            id: 3, text: 'Next Month'
        },
        {
            id: 4, text: 'Next 3 Months'
        },
        {
            id: 5, text: 'Next 6 Months'
        }]
    },
    computed: {
        "columns": function columns() {
            return Object.keys(this.financialItemKeys)
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/Forecast/getFinancialProfile').then(function (response) {
            try {
                this.todaysAmount = response.data;
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });

        axios.get(baseURL + 'api/forecast/getForecastColumns').then(function (response) {
            try {
                this.financialItemKeys = response.data;
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                return [];
            });


        axios.get(baseURL + 'api/forecast/getItems/' + this.startDate + '/' + this.endDate).then(function (response) {
            try {
                this.ForecastedItems = response.data;
                console.log(this.ForecastedItems);
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });

        //this.sortItems();
        //this.calculateRemainingBalance();
        console.log(this.ForecastedItems);
    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            ForecastController.errorMessage = false;
            ForecastController.alertMessage = text;
            setTimeout(function () { ForecastController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            ForecastController.errorMessage = true;
            ForecastController.alertMessage = text;
            setTimeout(function () { ForecastController.alertMessage = '' }, 3000);
        },
        "getForecastedItems": function getForecastedItems() {
            if (this.ForecastedItems.length > 0) {
                for (let i = 0; i < this.ForecastedItems.length; i++) {
                    var amount = this.ForecastedItems[i].Amount;
                    if (amount > 0) {
                        this.ForecastedItems[i].DepositAmount = formatter.format(amount)
                    }
                    else {
                        this.ForecastedItems[i].WithdrawalAmount = formatter.format(amount)
                    }
                    console.log(this.ForecastedItems[i]);
                }

                return this.ForecastedItems;
            }
            return [];
        },
        "ItemClicked": function ItemClicked(Item) {
            if (Item.amount > 0) {
                console.log("Deposit");
                this.selectedItemID = Item.id;
                this.selectedItem = Item;
            }
            else {
                console.log("Withdrawal");
                this.selectedItemID = Item.id;
                this.selectedItem = Item;
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
            axios.get(baseURL + 'api/forecast/getItems/' + this.startDate + '/' + this.endDate).then(function (response) {
                try {
                    this.ForecastedItems = response.data;
                    console.log(this.ForecastedItems);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    ForecastController.alertErrorMessage(error.response.data);
                    console.log(error);
                });

            this.selectedItem = null;
            this.selectedItemID = '';

        },

        "resetAlertMessage": function resetAlertMessage() {
            ForecastController.errorMessage = false;
            ForecastController.alertMessage = '';
        },
        "sortItems": function sortItems() {
            //this.currentPage = 1;
            this.ForecastedItems.sort(function (a, b) {
                if (a['Date'] > b['Date']) {
                    return 1;
                } else if (a['Date'] < b['Date']) {
                    return -1;
                }

                return 0;
            });               
        },
        "updateFinancialProfile": function updateFinancialProfile() {
            axios.post(baseURL + 'api/Forecast/updateFinancialProfile' + '/' + ForecastController.todaysAmount).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
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
            this.Deposit['Stop Date'] = date.addDays(365).toISOString().slice(0, 10);

            console.log(this.Deposit);
        },
        "createNewDeposit": function createNewDeposit() {
            console.log(this.Deposit);
            axios.post(baseURL + 'api/deposits/new', this.Deposit).then(function (response) {
                try {
                    console.log("Deposit was successfully added");
                    ForecastController.alertSuccessMessage("Deposit was successfully added");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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
            axios.post(baseURL + 'api/Deposits/edit/' + ForecastController.selectedDepositID, this.editedDeposit).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + ForecastController.selectedDepositID, Deposit).then(function (response) {
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
            axios.post(baseURL + 'api/Deposits/multipleEdits/' + ForecastController.selectedDepositID, this.editedDeposit, this.recurringDeposits).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "RemoveItem": function RemoveItem(Deposit) {

        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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
            if (ForecastController.Deposits.length === 0) {
                return [];
            }
            return Object.keys(ForecastController.Deposits[0]);
        }
    }
});


var DeleteModalController = new Vue({
    el: "#depositDeletionConfirmation",
    methods: {
        "deleteDeposit": function deleteDeposit() {
            axios.post(baseURL + 'api/deposits/deleteDeposit/' + ForecastController.selectedDepositID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
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
            console.log(this.Deposit);

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + ForecastController.selectedDepositID, Deposit).then(function (response) {
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
            axios.post(baseURL + 'api/deposits/deleteMultipleDeposits/' + ForecastController.selectedDepositID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    },
    computed: {
        "columns": function columns() {
            if (ForecastController.Deposits.length === 0) {
                return [];
            }
            return Object.keys(ForecastController.Deposits[0]);
        }
    }
});


const dateHandler = function (selectedDateID) {
    //Next Two Weeks
    if (selectedDateID === 1) {
        today = new Date();
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.addDays(14));

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //This Month
    else if (selectedDateID === 2) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next Month
    else if (selectedDateID === 3) {
        today = new Date();
        //today = new Date(today.getFullYear(), today.getMonth()+ 1, 1);
        var StartDate = new Date(today.toDateString());

       // today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 3 Months
    else if (selectedDateID === 4) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 6 Months
    else if (selectedDateID === 5) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 7, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    ForecastController.refreshTable();
};

serverBus.$on('dateSelected', dateHandler);