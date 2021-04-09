$('.ui.checkbox')
    .checkbox()
;

function showOutput(formid, status, message) {
    let form = $('#'+formid);
    let messageField = $('#'+formid+'Message');
    if (message != null) {
        switch (status) {
            case 'success':
                form.addClass('success').removeClass('error');
                messageField.addClass('ui message success').removeClass('error')
                    .html('<div class="header">Erfolg</div><p>' + message + '</p>');
                break;
            case  'error':
                form.addClass('error').removeClass('success');
                messageField.addClass('ui message error').removeClass('success')
                    .html('<div class="header">Fehler</div><p>' + message + '</p>');
                break;
        }
    }
}

$('#btnEditUserdata').on('click', function () {
    let username = $('#inputUsername').val();
    let fullname = $('#inputFullname').val();
    let email = $('#inputEmail').val();
    let admin = $('#inputAdmin').prop('checked')?1:0;
    let disabled = 0;
    if (username !== '' && fullname !== '' && email !== '' && admin !== '') {
        doAJAX('put', '/api/users/' + userID + '/', {
            username,
            fullname,
            email,
            admin,
            disabled
        }).done(function (data) {
            showOutput('formEdit', 'success', data.response);
            //setTimeout(location.reload.bind(location), 1200);
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showOutput('formEdit', 'error', data.error);
        });
    } else {
        //showToast('error', 'Bitte füllen Sie alle Felder aus.');
    }
});

$('#btnChangePassword').on('click', function () {
    const fieldCurrentPassword = $('#inputCurrentPassword');
    const fieldNewPassword = $('#inputNewPassword');
    const fieldRepeatPassword = $('#inputRepeatPassword');
    let currentPassword = fieldCurrentPassword.val();
    let newPassword = fieldNewPassword.val();
    let newPassword2 = fieldRepeatPassword.val();
    //reset form errors
    fieldCurrentPassword.parent().removeClass('error');
    fieldNewPassword.parent().removeClass('error');
    fieldRepeatPassword.parent().removeClass('error');

    if (currentPassword !== '' && newPassword !== '' && newPassword2 !== '' && newPassword === newPassword2) {
        doAJAX('put', '/api/users/' + userID + '/password/', {
            currentPassword,
            newPassword
        }).done(function (data) {
            showOutput('formPassword', 'success', data.response);
            //setTimeout(location.reload.bind(location), 1200);
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showOutput('formPassword', 'error', data.error);
            switch (data.error) {
                case 'Das alte Passwort ist nicht korrekt.':
                    fieldCurrentPassword.parent().addClass('error');
                    break;
                case 'Das Kennwort entspricht nicht den Anforderungen.':
                    fieldNewPassword.parent().addClass('error');
                    fieldRepeatPassword.parent().addClass('error');
                    break;
            }
        });
    } else if (newPassword !== newPassword2){
        fieldNewPassword.parent().addClass('error');
        fieldRepeatPassword.parent().addClass('error');
        showOutput('formPassword', 'error', 'Die Passwörter stimmen nicht überein.');
    } else {
        //showToast('error', 'Bitte füllen Sie alle Felder aus.');
    }
});
