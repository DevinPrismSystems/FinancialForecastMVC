const serverBus = new Vue();


Vue.component('date-picker', VueBootstrapDatetimePicker);
$.extend(true, $.fn.datetimepicker.defaults, {
    icons: {
        time: 'far fa-clock',
        date: 'far fa-calendar',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-chevron-left',
        next: 'fas fa-chevron-right',
        today: 'fas fa-calendar-check',
        clear: 'far fa-trash-alt',
        close: 'far fa-times-circle'
    }
});

var AccountDetailsController = new Vue({
    el: '#PeriodDetails',
    data: {
        currentPage: 1,
        elementsPerPage: 25,
        incomes: [],
        expenses: [],
        selectedItem: null,
        selectedItemID: -1,
        startRange: 0,
        endRange: 0,
        ItemCount: 0,
        errorMessage: false,
        alertMessage: '',
        query: '',
        startDate: StartDate,
        endDate: EndDate,
        config: {
            format: 'MM/DD/YYYY hh:mm:ss A',
            useCurrent: false,
            showClear: true,
            showClose: true,

        },
    },
    //computed: {
    //    "columns": function columns() {
    //        return Object.keys(this.ItemKeys);
    //    },
    //},
    //mounted: function () {
    //    axios.get(baseURL + 'api/Items/all').then(function (response) {
    //        try {
    //            this.Items = response.data;
    //            this.apiReturnedItems = response.data;
    //            this.filteredItems = response.data;
    //            this.ItemCount = this.Items.length;
    //        }
    //        catch (e) {
    //            console.log(e);
    //        }
    //    }.bind(this))
    //        .catch(function (error) {
    //            ItemsController.alertErrorMessage(error.response.data)
    //            console.log(error);
    //        });
    //},
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            AccountDetails.errorMessage = false;
            AccountDetails.alertMessage = text;
            setTimeout(function () { AccountDetails.resetAlertMessage() }, 60000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            AccountDetails.errorMessage = true;
            AccountDetails.alertMessage = text;
            setTimeout(function () { AccountDetails.resetAlertMessage() }, 5000);
        },
        "ItemClicked": function ItemClicked(Item) {
            this.selectedItemID = Item.ItemID;
            this.selectedItem = Item;
            console.log(this.selectedItem);
        },
        "editItem": function editItem() {
            var myUrl;
            myUrl = baseURL + 'Items/Edit/' + this.selectedItemID;
            window.location.href = myUrl;
        },
        "getItems": function getAccountDetails() {
            var start = (this.currentPage - 1) * this.elementsPerPage;
            var end = start + this.elementsPerPage;

            this.startRange = start;
            if (start + this.elementsPerPage > this.ItemCount)
                this.endRange = this.ItemCount;
            else
                this.endRange = start + this.elementsPerPage;

            if (this.filteredItems.length > 0 && this.filtering === true) {
                this.ItemCount = this.filteredItems.length;
                return this.filteredItems.slice(start, end);
            }
            else if (this.filteredItems.length === 0 && this.filtering === true) {
                this.ItemCount = 0;
                return [];
            }
            else {
                this.ItemCount = this.apiReturnedItems.length;
                this.filteredItems = this.apiReturnedItems;
                return this.apiReturnedItems.slice(start, end);
            }
        },
        "resetAlertMessage": function resetAlertMessage() {
            ItemsController.errorMessage = false;
            ItemsController.alertMessage = '';
        },
    },
    watch: {
        SelectedDateID: function (value) {
            serverBus.$emit('dateSelected', this.SelectedDateID);
        }
    }
});

var ItemAdditionController = new Vue({
    el: "#ItemAdditionConfirmation",
    methods: {
        "addToItemSchedule": function addToItemSchedule() {
            ItemsController.addToItemSchedule();
            $('#ItemAdditionConfirmation').modal('hide');
        }
    }
});

const dateHandler = function (selectedDateID) {
    //Last Seven Days
    if (selectedDateID === 1) {
        today = new Date();
        today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);

        ItemsController.startDate = StartDate;
        ItemsController.endDate = EndDate;
    }

    //Yesterday
    else if (selectedDateID === 2) {
        today.setDate(today.getDate() - 1);
        StartDate = new Date(today.toDateString());
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }

    //Week to Date
    else if (selectedDateID === 3) {
        today.setDate(today.getDate() - today.getDay());
        StartDate = new Date(today.toDateString());
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }

    //Month to Date
    else if (selectedDateID === 4) {
        today.setDate(today.getDate() - today.getDay());
        StartDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }

    //Previous Month
    else if (selectedDateID === 5) {
        today.setDate(today.getDate() - today.getDay());
        StartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }
    //Previous Quarter
    else if (selectedDateID === 6) {

        //January - March
        if (today.getMonth() < 3) {
            StartDate = new Date(today.getFullYear() - 1, 9, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 0);

            ItemsController.startDate = StartDate;
            ItemsController.endDate = EndDate;
        }

        //April - June
        else if (today.getMonth() > 2 && today.getMonth() < 6) {
            StartDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear(), 2, 31, 23, 59, 59, 0);

            ItemsController.startDate = StartDate;
            ItemsController.endDate = EndDate;
        }

        //July-September
        else if (today.getMonth() > 5 && today.getMonth() < 9) {
            StartDate = new Date(today.getFullYear(), 3, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear(), 5, 30, 23, 59, 59, 0);

            ItemsController.startDate = StartDate;
            ItemsController.endDate = EndDate;
        }

        //October  - December
        else if (today.getMonth() > 8) {
            StartDate = new Date(today.getFullYear(), 6, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear(), 8, 30, 23, 59, 59, 0);

            ItemsController.startDate = StartDate;
            ItemsController.endDate = EndDate;
        }
    }

    //Year to Date
    else if (selectedDateID === 7) {
        today.setDate(today.getDate() - today.getDay());
        StartDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }
    //Previous half year
    else if (selectedDateID === 8) {

        //first part of the year
        if (today.getMonth() < 6) {
            today = new Date();
            StartDate = new Date(today.getFullYear() - 1, 6, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 0);

        }

        else {
            StartDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
            EndDate = new Date(today.getFullYear(), 5, 30, 23, 59, 59, 0);
        }
        ItemsController.startDate = StartDate;
        ItemsController.endDate = EndDate;
    }

    else {

        StartDate = new Date(today.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        ItemsController.startDate = StartDate;

        today = new Date();
        EndDate = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 0);
        ItemsController.endDate = EndDate;
    }
};

serverBus.$on('dateSelected', dateHandler);

