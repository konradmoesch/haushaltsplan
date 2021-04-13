$(document).ready(function () {
    createCalendars();
    setDatesOnPickers();
    //loadCharts();
    loadStats();
});

function reloadPagination() {
    $('#monthDisplay').text(new Date($('#datepickerStart').val()).toLocaleDateString('de-DE', {
        month: 'long'
    }));
}

function changeMonth(dir) {
    let firstdate = new Date($('#datepickerStart').val());
    let lastdate = new Date($('#datepickerEnd').val());
    if(dir==='+'){
        firstdate.setMonth(firstdate.getMonth()+1);
        lastdate = new Date(lastdate.getFullYear(), lastdate.getMonth()+2, 0);
    } else if (dir==='-') {
        firstdate.setMonth(firstdate.getMonth()-1);
        lastdate = new Date(lastdate.getFullYear(), lastdate.getMonth(), 0);
    }
    $('#datepickerStart').val(firstdate.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
    $('#datepickerEnd').val(lastdate.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
    reloadPagination();
    loadStats();
}

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
    reloadPagination();
}

function loadCharts() {
    //Charts
    let ctx = $('#barChart');
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
}

function loadStats() {
    //Einnahmen
    doAJAX('get', '/api/earnings/' + userID + '/sumall/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        $('#statEarnings').text(formatMoney(data.response[0].sum));
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Statistik (Einnahmen) konnte nicht geladen werden', data.error);
    });
    //Ausgaben
    doAJAX('get', '/api/expenses/' + userID + '/sumall/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        $('#statExpenses').text('-'+formatMoney(data.response[0].sum));
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Statistik (Einnahmen) konnte nicht geladen werden', data.error);
    });
    //Bilanz
    doAJAX('get', '/api/balance/' + userID + '/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        $('#statBalance').text(formatMoney(data.response[0].sum));
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Statistik (Einnahmen) konnte nicht geladen werden', data.error);
    });
}

//Reload on Change
$('#datepickerEnd').on('change', function () {
    loadStats();
    loadCharts();
    reloadPagination();
});
$('#prevMonthBtn').on('click', function () {
    changeMonth('-');
})
$('#nextMonthBtn').on('click', function () {
    changeMonth('+');
})
