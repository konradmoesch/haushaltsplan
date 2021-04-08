$('#editUserBtn').on('click', function () {
    let username = $('#username').val();
    let fullname = $('#fullname').val();
    let email = $('#email').val();
    let admin = $('#admin').val();
    if (username !== '' && fullname !== '' && email !== '' && admin !== '') {
        doAJAX('put', '/api/users/1/', {
            username,
            fullname,
            email,
            admin
        }).done(function (data) {
            //showToast('success', data.response);
            console.log('success');
            setTimeout(location.reload.bind(location), 1200);
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            console.error(data.errorCode + ":" + data.error);
            //showToast('error', data.error, data.errorCode);
        });
    } else {
        //showToast('error', 'Bitte füllen Sie alle Felder aus.');
    }
});
