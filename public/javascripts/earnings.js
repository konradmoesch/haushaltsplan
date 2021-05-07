let leftChart, centerChart, rightChart;

$(document).ready(function () {
    createCalendars();
    setDatesOnPickers();
    loadCharts();
    loadDT();
});

function createCalendars() {
    //Range-Datepickers
    $('#rangestart').calendar({
        type: 'date',
        endCalendar: $('#rangeend')
    });
    $('#rangeend').calendar({
        type: 'date',
        startCalendar: $('#rangestart')
    });
    //Addform-Datepicker
    $('#selectDate').calendar({type: 'date'});
    //Dropdowns
    $('.selection.dropdown').dropdown();
}

function setDatesOnPickers() {
    //Set Dates On Calendars
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    $('#datepickerStart').val(firstDay);
    $('#datepickerEnd').val(lastDay);
}

function loadCharts(reload = false) {
    //Charts
    const left = $('#leftChart');
    const center = $('#centerChart');
    const right = $('#rightChart');

    if(!reload) {
        doAJAX('get', '/api/earnings/' + userID + '/sum/', {
            firstdate: formatDateYYYYMMDD($('#datepickerStart').val()),
            lastdate: formatDateYYYYMMDD($('#datepickerEnd').val())
        }).done(function (data) {
            leftChart = new Chart(left, {
                type: 'doughnut',
                data: {
                    labels: ['Wiederkehrend', 'Sonstige'],
                    datasets: [{
                        label: 'Einnahmen',
                        data: [
                            data.response[0].sumRecurring,
                            data.response[0].sumOther
                        ],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 205, 86)'
                        ],
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Kategorien',
                        }
                    }
                }
            });
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
        });

        doAJAX('get', '/api/earnings/' + userID + '/days/', {
            firstdate: formatDateYYYYMMDD($('#datepickerStart').val()),
            lastdate: formatDateYYYYMMDD($('#datepickerEnd').val())
        }).done(function (data) {
            centerChart = new Chart(center, {
                type: 'doughnut',
                data: {
                    labels: ['Wiederkehrend', 'Sonstige'],
                    datasets: [{
                        label: 'Ausgaben',
                        data: [
                            data.response[0].sumRecurring,
                            data.response[0].sumOther
                        ],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 205, 86)'
                        ],
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tägliche Einnahmen',
                        }
                    }
                }
            });
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
        });
    } else {
        leftChart.destroy();
        centerChart.destroy();
        //rightChart.destroy();
        loadCharts();
    }
}

function loadDT() {
    //recurring earnings table
    $('#table_recurring_earnings').DataTable({
        columns: [
            {data: 'name'},
            {
                data: 'date',
                render: function (data, type, row) {
                    return convertToGermanDate(data);
                }
            },
            {
                data: 'value',
                render: function (data, type, row) {
                    return formatMoney(data);
                }
            }
        ],
        ajax: {
            url: '/api/earnings/'+ userID,
            type: 'get',
            data: (d) => { d.firstdate=formatDateYYYYMMDD($('#datepickerStart').val()); d.lastdate=formatDateYYYYMMDD($('#datepickerEnd').val()); d.category=0; },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
    //other earnings table
    $('#table_other_earnings').DataTable({
        columns: [
            {data: 'name'},
            {
                data: 'date',
                render: function (data, type, row) {
                    return convertToGermanDate(data);
                }
            },
            {
                data: 'value',
                render: function (data, type, row) {
                    return formatMoney(data);
                }
            }
        ],
        ajax: {
            url: '/api/earnings/'+ userID,
            type: 'get',
            data: (d) => { d.firstdate=formatDateYYYYMMDD($('#datepickerStart').val()); d.lastdate=formatDateYYYYMMDD($('#datepickerEnd').val()); d.category=1; },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
}

//Reload on Change
$('#datepickerEnd').on('change', function () {
    reloadDT('#table_recurring_earnings');
    reloadDT('#table_other_earnings');
    loadCharts(true);
});

//Addbutton
$('#btnAddEarning').on('click', function () {
    let category = $('#selectCategory').val();
    let name = $('#inputName').val();
    let date = formatDateYYYYMMDD($('#inputDate').val());
    let value = $('#inputValue').val();

    if (category !== '' && name !== '' && date !== '' && value !== '') {
        doAJAX('post', '/api/earnings/' + userID + '/', {
            category,
            name,
            date,
            value
        }).done(function (data) {
            showToast('success', null, 'Diese Einnahme ist erfolgreich hinzugefügt worden.');
            reloadDT('#table_recurring_earnings');
            reloadDT('#table_other_earnings');
            loadCharts(true);
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', null, data.error);
        });
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});
