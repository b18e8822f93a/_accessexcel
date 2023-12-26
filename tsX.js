;
const baseOptions = {
    title: {
        text: null
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            animation: false,
        },
    }
}

function addChart(series, containerName, chartOptions) {

    let options = {
        series: series
    };

    var opts = { ...options, ...chartOptions };
    var fullOpts = jQuery.extend(true, opts, baseOptions);
    var container = $("#" + containerName);
    container.highcharts(fullOpts);
};
const radioButtonCreate = {

    setUpEventListenersRadioButton: function setUpEventListenersRadioButton(name, onChange) {

        document.querySelectorAll(`input[type=radio][name="${name}"]`)
        .forEach(x => x.addEventListener("input", () => onChange(x.value)));
    },

    setUpEventListenersCheckboxButton: function setUpEventListenersRadioButton(name, onChange) {
        $(`input[name="${name}"]`).change(function () {
            var v = Array.from($(`input[name='${name}']:checked`)).map((o) => o.value);
            console.log(v, "v")
            onChange(v);
        });
    },

    getAnRadioButton: function getAnRadioButton(id, label, name, isChecked, className = 'btn-outline-info') {

        let checked =  id === 0 ? "checked" : "";

        if(typeof isChecked !== 'undefined')
             checked =  isChecked ? "checked" : ""; 
       
        var radioHtml = `<input class='btn-check btn-sm' type='radio' id='${name}${id}' value='${id}' name='${name}' ${checked}/>`;
        var labelHtml = `<label class='btn ${className} btn-sm'  for='${name}${id}'>${label}</label>`;

        return radioHtml + labelHtml;
    },

    getAnCheckButton: function (id, label, name, className = 'btn-outline-info') {
        let checked = id === 0 ? "checked" : "";
        var radioHtml = `<input class='btn-check' type='checkbox' id='${name}${id}' value='${id}' name='${name}' ${checked}/>`;
        var labelHtml = `<label class='btn ${className} '  for='${name}${id}'>${label}</label>`;

        return radioHtml + labelHtml;
    }
}