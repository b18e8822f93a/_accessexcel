;
const outageChart = {
    title: {
        text: null
    },
    chart: {
        type: "column"
    },
    boost: {
        useGPUTranslations: true
    },

    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: { text: "MWh" }
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        // series: {
        //     pointStart: Date.UTC(2010, 0, 1),
        //     pointInterval: (24 * 3600 * 1000) / 48 // one day
        // },
        // area: {
        //     stacking: true
        // },
        column: {
            stacking: 'normal',
            pointPadding: 0,
            borderWidth: .1,
            groupPadding: 0.00,
            dataLabels: {
                enabled: false
            }
        }
    },
}

const outageModule = {

    addTable: function (items) {
        let tb0 = '<table class="T2" border=3><thead><th>Fuel</th><th>Plant</th><th>Unit</th><th>Unavailability (MW)</th><th>Capacity (MW)</th><th>Availability (MW)</th><th>Fraction</th><th>Duration</th><th>Start</th><th>End</th><th>Published</th></thead><tbody>';

        items.forEach(element => {
            tb0 += '<tr>';
            tb0 += '<td>';
            tb0 += element.fuelName;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.plant;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.unit;
            tb0 += '</td>';
            tb0 += '<td class ="searchText">';
            tb0 += element.volume;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.capacity;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.availability;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.fraction;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.duration;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.startDate;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.endDate;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.publishedDate;
            tb0 += '</td>';
            tb0 += '</tr>';
        })
        tb0 += '</tbody>';
        return tb0;
    },
}

const outagePage = {
    setUnitMenu() {
        $("#sl2").empty();
        var x2 = document.getElementById("sl2");

        for (const o of publishedDates) {
            console.log(`${o}`);
            var option = document.createElement("option");
            option.text = o;
            option.value = o;
            x2.add(option, o);
            option.selected = true;
            globalVariable.byDate = o;
        };

        var option = document.createElement("option");
        option.text = '*';
        option.value = '*';
        // x2.add(option, '*');
    },
    reDrawTable: function () {

        var q0 = globalVariable.filterLabel === '*' ? outageRows : outageRows.filter(x => x.fuelName == globalVariable.filterLabel)
        //var q = globalVariable.isLatestOnly == '0' ? q0 : q0.filter(x => x.isLatest == 1)
        var q = globalVariable.byDate === '*' ? q0 : q0.filter(x => x.publishedDate == globalVariable.byDate)


        let tableDiv = document.querySelector('#dvTable2');
        tableDiv.innerHTML = outageModule.addTable(q);
    },

    reDrawChart: function () {

        if (globalVariable.btnRadioValue == 0) {
            var q0 = globalVariable.filterLabel === '*' ? unitChartSeries : unitChartSeries.filter(x => x.label == globalVariable.filterLabel.replaceAll(' ', ''))
            var q = globalVariable.byDate === '*' ? q0 : q0.filter(x => x.key1 == globalVariable.byDate)
            var q3 = globalVariable.isTwoYears !== "0" ? q : q.map(o => { return { ...o, data: o.data.filter(x => x[2] === 0) }; });
            var q4 = globalVariable.isAvailability === "0" ? q3 : q3.map(o => { return { ...o, data: o.data.map(x => [x[0], x[3]]) }; });
            console.log(globalVariable.filterLabel.replace(' ', ''))
            console.log(globalVariable.isTwoYears, "isTwoYears")
            console.log(q4, "unit chart series")
            addChart(q4, "dvChart2", outageChart);
        }
        else {
            var q0 = globalVariable.filterLabel === '*' ? fuelChartSeries : fuelChartSeries.filter(x => x.name == globalVariable.filterLabel.replaceAll(' ', ''))
            var q = globalVariable.byDate === '*' ? q0 : q0.filter(x => x.key1 == globalVariable.byDate)
            var q3 = globalVariable.isTwoYears !== "0" ? q : q.map(o => { return { ...o, data: o.data.filter(x => x[2] === 0) }; });
            var q4 = globalVariable.isAvailability === "0" ? q3 : q3.map(o => { return { ...o, data: o.data.map(x => [x[0], x[3]]) }; });

            addChart(q4, "dvChart2", outageChart);
        }
    },
    dispatch: function (message) {
        switch (message.key) {
            case "switchChart":
                globalVariable.btnRadioValue = message.value;
                this.reDrawChart();
                break;

            case "twoYears":
                globalVariable.isTwoYears = message.value;
                this.reDrawChart();
                break;

            case "isUnavailability":
                globalVariable.isAvailability = message.value;
                this.reDrawChart();
                break;
            case "filter":

                var name = globalVariable.uniqueFuels[message.value];
                globalVariable.filterLabel = name;
                this.reDrawTable()
                this.reDrawChart();
                break;

            case "latest":
                globalVariable.isLatestOnly = message.value;
                this.reDrawTable()
                break;

            case "byDate":
                globalVariable.byDate = message.value;
                this.reDrawTable()
                this.reDrawChart();
                break;


        }

    },


    setUpEventListeners: function () {

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioA', (v) =>
            outagePage.dispatch({ key: 'switchChart', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioB', (v) =>
            outagePage.dispatch({ key: 'filter', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioE', (v) =>
            outagePage.dispatch({ key: 'latest', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioK', (v) =>
            outagePage.dispatch({ key: 'twoYears', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioJ', (v) =>
            outagePage.dispatch({ key: 'isUnavailability', value: v }));

        document.getElementById("sl2").onchange = function (x) {

            console.log(this.value)
            outagePage.dispatch({ key: 'byDate', value: this.value });
        }
    },
    onLoad: function () {
        let ids = outageRows.map(x => x.fuelName).sort();
        globalVariable.uniqueFuels = ['*', ...new Set(ids)];
        // var radioButtons = ['units', 'fuels'].map((x, i) => radioButtonCreate.getAnRadioButton(i, x, 'btnRadioB')).join('');
        // var buttonsDiv = document.querySelector('#dvButtons');

        // buttonsDiv.innerHTML = radioButtons;
        console.log(outageRows);
        outagePage.setUnitMenu();
        //TableFilterModule.initialiseNumberInputBox('#myInput', TableFilterModule.filterTable)

        outagePage.reDrawChart();
        outagePage.reDrawTable();
    }
};
const plantsChart = {

    chart: {
        type: "column"
    },

    xAxis: {
        // labels: { enabled: true },
        //  categories: ['Green', 'Pink'],
        type: 'category'
    },
    yAxis: {
        title: { text: "MWh" }
    },
    legend: {
        enabled: false
    },
    plotOptions: {

        column: {
            pointPadding: 0,
            borderWidth: .1,
            groupPadding: 0.00,
            // pointWidth: 0.1,
            //stacking: 'normal',
            dataLabels: {
                enabled: false
            }
        }
    },
};

const plantsModule = {

    addTable: function (items) {
        let tb0 = '<table class="T2" border=3><thead><th>Plant</th><th>Unit</th><th>Capacity</th><th>Fuel</th></thead>';//<th>Outages</th>

        items.forEach(element => {
            tb0 += '<tr>';
            tb0 += '<td>';
            tb0 += element.name;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.unit;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.capacity;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.fuelType;
            tb0 += '</td>';
            // tb0 += '<td>';
            // tb0 += element.futureOutages;
            // tb0 += '</td>';
            tb0 += '</tr>';
        })

        return tb0;
    },
}

const plantsPage = {

    reDrawChart: function reDrawChart() {
        if (globalVariable.btnRadioValue == 0) {
            var q = globalVariable.filterLabel === '*' ? unitSeries : unitSeries.filter(x => x.label == globalVariable.filterLabel)
            console.log(q)
            let newSeries = [{ data: q }]
            addChart(newSeries, "dvChart", plantsChart);
        }
        else {
            var q = globalVariable.filterLabel === '*' ? fuelSeries : fuelSeries.filter(x => x.name == globalVariable.filterLabel)
            let newSeries = [{ data: q }]
            addChart(newSeries, "dvChart", plantsChart);
        }
    },
    reDrawTable: function reDrawTable() {
        let tableDiv = document.querySelector('#dvTable');
        if (globalVariable.btnRadioValue == 0) {
            var q = globalVariable.filterLabel === '*' ? plantsTable : plantsTable.filter(x => x.fuelType == globalVariable.filterLabel)
            tableDiv.innerHTML = plantsModule.addTable(q);
        }
        else {
            var q = globalVariable.filterLabel === '*' ? fuelSeries : fuelSeries.filter(x => x.name == globalVariable.filterLabel)
            var l = q.map(o => ({ name: 'All Units', capacity: o.y, fuelType: o.name, futureOutages: o.y2 }))
            tableDiv.innerHTML = plantsModule.addTable(l);
        }
    },

    dispatch: function (message) {
        switch (message.key) {


            case "byUnit":
                globalVariable.btnRadioValue = message.value;
                this.reDrawChart();
                this.reDrawTable()
                break;

            case "filter":
                var name = globalVariable.uniqueFuels[message.value];
                globalVariable.filterLabel = name;
                console.log(name, "filter")
                this.reDrawChart()
                this.reDrawTable()
                break;
        }
    },


    setUpEventListeners: function () {
        radioButtonCreate.setUpEventListenersRadioButton('btnRadioB', (v) =>
            plantsPage.dispatch({ key: 'filter', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioA', (v) =>
            plantsPage.dispatch({ key: 'byUnit', value: v }));


    }
    ,
    onLoad: function () {
        let ids = plantsTable.map(x => x.fuelType).sort();
        globalVariable.uniqueFuels = ['*', ...new Set(ids)];
        console.log(globalVariable.uniqueFuels, "unique fuel names");





        plantsPage.dispatch({ key: 'toggle', value: 0 });
        plantsPage.reDrawTable();
        plantsPage.reDrawChart();

    }
};
const globalVariable = {
    btnRadioValue: 0,
    uniqueFuels: [],
    filterLabel: '*',
    isLatestOnly: 0,
    byDate: '*',
    isTwoYears: "0",
    isAvailability: "0",
}

const basePage = {
    reToggleChartAndTable: function () {
        if (globalVariable.showTable == 1) {
            //e//lem.classList.add('hiding2');
            $('.dvTable').toggleClass("hiding2", true);//.hide();

            $('.dvChart').toggleClass("hiding2", false);
            $('.clCharts').toggleClass("hiding2", false);

        }
        else if (globalVariable.showTable == 2) {
            $('.dvTable').toggleClass("hiding2", true);//.hide();

            $('.dvChart').toggleClass("hiding2", false);
            $('.clCharts').toggleClass("hiding2", false);
        }
        else {

            $('.dvTable').toggleClass("hiding2", false);
            $('.dvChart').toggleClass("hiding2", true);
            $('.clCharts').toggleClass("hiding2", true);
        }
        console.log("reflow it");
        $('.dvChart').highcharts().reflow();
        // $('#dvChart').highcharts().reflow();
    },
    dispatch: function (message) {
        switch (message.key) {
            case "toggle":
                globalVariable.showTable = message.value;
                this.reToggleChartAndTable();
                break;
        }
    },
    setUpEventListeners: function () {
        radioButtonCreate.setUpEventListenersRadioButton('btnRadioC', (v) =>
            this.dispatch({ key: 'toggle', value: v }));

    },
    addFuelRadioButtons: function () {
        var radioButtons = globalVariable.uniqueFuels.map((x, i) => radioButtonCreate.getAnRadioButton(i, x, 'btnRadioB')).join('');

        var buttonsDiv = document.querySelector('#dvButtons');

        buttonsDiv.innerHTML = radioButtons;
    },
    onLoad: function () {
        this.setUpEventListeners();
        this.reToggleChartAndTable();
        this.addFuelRadioButtons();
    }
};
const appPage = {
    reLayout: function () {

        let cap = document.querySelectorAll(".cell3");
        let out = document.querySelectorAll(".cell2");

        // this was to hide but seems wierd to select nothing to show, maybe change in future
        if (globalVariable.showSections.length == 0) {

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
            document.getElementById("gdMain").style.gridTemplateRows = "1fr 1fr";
        }
        else if (globalVariable.showSections.length == 2) {

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
            document.getElementById("gdMain").style.gridTemplateRows = "1fr 1fr";
        }

        else if (globalVariable.showSections[0] == 0) {
            document.getElementById("gdMain").style.gridTemplateRows = "1fr";

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.add('hiding');
        }
        else if (globalVariable.showSections[0] == 1) {
            document.getElementById("gdMain").style.gridTemplateRows = "1fr ";
            for (let elem of cap)
                elem.classList.add('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
        }

        console.log("should be laying out")
        $('#dvChart').highcharts().reflow();
        $('#dvChart2').highcharts().reflow();

    },

    dispatch: function (message) {
        console.log(message);
        switch (message.key) {
            case "layout":
                globalVariable.showSections = message.value;
                this.reLayout();
                break;
        }
    },

    setUpEventListeners: function () {
        radioButtonCreate.setUpEventListenersCheckboxButton('btnRadioD', (v) =>
            this.dispatch({ key: 'layout', value: v }));
    },

    onLoad: function () {
        this.setUpEventListeners();
    }
}