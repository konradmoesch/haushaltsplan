function showToast(state, title, message) {
    $('body')
        .toast({
            class: state,
            title: title,
            message: message,
            showProgress: 'bottom'
        })
    ;
}
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatMoney(floatVal) {
    return Number(floatVal).toLocaleString('de-DE', {'currency': 'EUR', 'style': 'currency'});
}

let ctx = $('#myChart');
doAJAX('get', '/api/earnings/' + userID + '/sum/',{firstdate: formatDate($('#datepickerStart').val()), lastdate: formatDate($('#datepickerEnd').val()) }).done(function (data) {
    let myChart = new Chart(ctx, {
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
                    text: 'Verteilung',
                }
            }
        }
    });
}).fail(function (xhr) {
    let data = xhr.responseJSON;
    showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
});

/*let ctx2 = $('#myChart2');
doAJAX('get', '/api/earnings/' + userID + '/days/',{firstdate: formatDate($('#datepickerStart').val()), lastdate: formatDate($('#datepickerEnd').val()) }).done(function (data) {
    let myChart = new Chart(ctx2, {
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
                    text: 'Verteilung',
                }
            }
        }
    });
}).fail(function (xhr) {
    let data = xhr.responseJSON;
    showToast('error', 'Diagramm konnte nicht geladen werden', data.error);
});*/


$(function () {
    let tableRecurringEarnings = $('#table_recurring_earnings').DataTable({
        columns: [
            {data: 'name'},
            {
                data: 'date',
                render: function (data, type, row) {
                    let date = new Date(data).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    return date;
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
            data: (d) => { d.firstdate=formatDate($('#datepickerStart').val()); d.lastdate=formatDate($('#datepickerEnd').val()); d.category=0; },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
    let tableOtherEarnings = $('#table_other_earnings').DataTable({
        columns: [
            {data: 'name'},
            {
                data: 'date',
                render: function (data, type, row) {
                    let date = new Date(data).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    return date;
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
            data: (d) => { d.firstdate=formatDate($('#datepickerStart').val()); d.lastdate=formatDate($('#datepickerEnd').val()); d.category=1; },
            dataSrc: 'response'
        },
        "searching": false,
        order: [[1, 'asc']]
    });
});
$('#rangestart').calendar({
    type: 'date',
    endCalendar: $('#rangeend')
});
$('#rangeend').calendar({
    type: 'date',
    startCalendar: $('#rangestart')
});
$('.selection.dropdown').dropdown();

$('#selectDate').calendar({type: 'date'});

$(function () {
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
});

$('#datepickerEnd').on('change', function () {
    reloadDT('#table_recurring_earnings');
    reloadDT('#table_other_earnings');
});

$('#btnAddEarning').on('click', function () {
    let category = $('#selectCategory').val();
    let name = $('#inputName').val();
    let date = formatDate($('#inputDate').val());
    let value = $('#inputValue').val();

    if (category !== '' && name !== '' && date !== '' && value !== '') {
        doAJAX('post', '/api/earnings/' + userID + '/', {
            category,
            name,
            date,
            value
        }).done(function (data) {
            showToast('success', null, data.response);
            reloadDT('#table_recurring_earnings');
            reloadDT('#table_other_earnings');
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', null, data.error);
        });
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});
