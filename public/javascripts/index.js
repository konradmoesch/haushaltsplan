$('#sendFeedback').on('click', function () {
    let msg = $('#newFeedbackMsg').val();
    if (msg !== '') {
        doAJAX('get', '/api/balance/2/test', {message: msg}).done(function (data) {
            if(data.response) {
                showToast('success', null, data.response);
                $('#newFeedbackMsg').val('');
            } else showToast('error', 'Fehler', 'Keine valide Serverantwort');
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', 'Fehler (' + data.status + ')', data.error);
        });
    } else {
        showToast('error', 'Bitte geben Sie eine Nachricht ein.');
    }
});
