$('#sendFeedback').on('click', function () {
    let msg = $('#newFeedbackMsg').val();
    if (msg !== '') {
        doAJAX('put', '/api/feedback', {msg}).done(function (data) {
            //showToast('success', data.response);
            console.log(data.response);
            $('#newFeedbackMsg').val('');
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            //showToast('error', data.error, data.errorCode);
            console.error(data.error);
        });
    } else {
        //showToast('error', 'Bitte geben Sie eine Nachricht ein.');
        console.error('Bitte geben Sie eine Nachricht ein.');
    }
});
