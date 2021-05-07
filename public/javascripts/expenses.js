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
    //Set Dates On Pickers
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

function loadCharts() {
    //Charts
    let ctx = $('#myChart');
    doAJAX('get', '/api/expenses/' + userID + '/sum/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Lokal', 'Wiederkehrend', 'Online'],
                datasets: [{
                    label: 'Ausgaben',
                    data: [
                        data.response[0].sumLocal,
                        data.response[0].sumRecurring,
                        data.response[0].sumOnline
                    ],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Verteilung',
                    }
                }
            }
        });
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
    });

    let ctx2 = $('#myChart2');
    doAJAX('get', '/api/expenses/' + userID + '/groupname/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.response.map(obj => {
                    return obj.name;
                }),
                datasets: [{
                    label: 'Ausgaben',
                    data: data.response.map(obj => {
                        return obj.value;
                    }),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Verteilung',
                    }
                }
            }
        });
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
    });
}

function loadDT() {
    //local store expenses table
    $('#table_store_expenses').DataTable({
        columns: [
            {data: 'name'},
            {data: 'place'},
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
            url: '/api/expenses/'+ userID,
            type: 'get',
            data: (d) => { d.firstdate=formatDateYYYYMMDD($('#datepickerStart').val()); d.lastdate=formatDateYYYYMMDD($('#datepickerEnd').val()); d.category=0 },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
    //recurring expenses table
    $('#table_recurring_expenses').DataTable({
        columns: [
            {data: 'name'},
            {data: 'place'},
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
            url: '/api/expenses/'+ userID,
            type: 'get',
            data: (d) => { d.firstdate=formatDateYYYYMMDD($('#datepickerStart').val()); d.lastdate=formatDateYYYYMMDD($('#datepickerEnd').val()); d.category=1; },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
    //online expenses table
    $('#table_online_expenses').DataTable({
        columns: [
            {data: 'name'},
            {data: 'place'},
            {
                data: 'date',
                render:  function (data, type, row) {
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
            url: '/api/expenses/'+ userID,
            type: 'get',
            data: (d) => { d.firstdate=formatDateYYYYMMDD($('#datepickerStart').val()); d.lastdate=formatDateYYYYMMDD($('#datepickerEnd').val()); d.category=2 },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
}

//Reload on Change
$('#datepickerEnd').on('change', function () {
    reloadDT('#table_store_expenses');
    reloadDT('#table_recurring_expenses');
    reloadDT('#table_online_expenses');
    loadCharts();
});

//Addbutton
$('#btnAddExpense').on('click', function () {
    let category = $('#selectCategory').val();
    let product = $('#inputProduct').val();
    let place = $('#inputPlace').val();
    let date = formatDateYYYYMMDD($('#inputDate').val());
    let value = $('#inputValue').val();

    if (category !== '' && product !== '' && place !== '' && date !== '' && value !== '') {
        doAJAX('post', '/api/expenses/' + userID + '/', {
            category,
            product,
            place,
            date,
            value
        }).done(function (data) {
            showToast('success', null, 'Diese Ausgabe ist erfolgreich hinzugefügt worden.');
            reloadDT('#table_store_expenses');
            reloadDT('#table_recurring_expenses');
            reloadDT('#table_online_expenses');
            loadCharts();
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', null, data.error);
        });
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});
