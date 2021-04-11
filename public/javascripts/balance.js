$(document).ready(function () {
    createCalendars();
    setDatesOnPickers();
    //loadCharts();
    loadStats();
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
    let ctx = $('#barChart');
    doAJAX('get', '/api/expenses/' + userID + '/sum/',{firstdate: formatDateYYYYMMDD($('#datepickerStart').val()), lastdate: formatDateYYYYMMDD($('#datepickerEnd').val()) }).done(function (data) {
        let myChart = new Chart(ctx, {
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
        $('#statBalance').text('-'+formatMoney(data.response[0].sum));
    }).fail(function (xhr) {
        let data = xhr.responseJSON;
        showToast('error', 'Statistik (Einnahmen) konnte nicht geladen werden', data.error);
    });
}

//Reload on Change
$('#datepickerEnd').on('change', function () {
    //reload Charts
});