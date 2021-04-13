$('#sendFeedback').on('click', function () {
    let msg = $('#newFeedbackMsg').val();
    if (msg !== '') {
        doAJAX('put', '/api/feedback', {msg}).done(function (data) {
            if(data.response) {
                showToast('success', null, 'Erfolgreich Abgesendet');
                $('#newFeedbackMsg').val('');
            } else showToast('error', null, 'Keine valide Serverantwort');
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', 'Fehler (' + data.errorCode + ')', data.error);
        });
    } else {
        showToast('error', 'Bitte geben Sie eine Nachricht ein.');
    }
});
