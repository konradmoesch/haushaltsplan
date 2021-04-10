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

$('.ui.checkbox')
    .checkbox()
;

$('#formEdit')
    .form({
        on: 'submit',
        fields: {
            fullname: 'empty',
            username: 'empty',
            email: 'email'
        }
    })
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
    if (username !== '' && fullname !== '' && email !== '') {
        doAJAX('put', '/api/users/' + userID + '/', {
            username,
            fullname,
            email,
            admin,
            disabled
        }).done(function (data) {
            showToast('success', 'Erfolg', data.response);
            //setTimeout(location.reload.bind(location), 1200);
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', null, data.error);
        });
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});

$('#formPassword')
    .form({
        on: 'submit',
        fields: {
            currentpw: 'empty',
            newpw: 'empty',
            newpw2: ['empty', 'match[newPw]']
        }
    })
;

$('#btnChangePassword').on('click', function () {
    const fieldCurrentPassword = $('#inputCurrentPassword');
    const fieldNewPassword = $('#inputNewPassword');
    const fieldRepeatPassword = $('#inputRepeatPassword');
    let currentPassword = fieldCurrentPassword.val();
    let newPassword = fieldNewPassword.val();
    let newPassword2 = fieldRepeatPassword.val();

    if (currentPassword !== '' && newPassword !== '' && newPassword2 !== '' && newPassword === newPassword2) {
        doAJAX('put', '/api/users/' + userID + '/password/', {
            currentPassword,
            newPassword
        }).done(function (data) {
            showToast('success', null, data.response);
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
        showToast('error', null, 'Die Passwörter stimmen nicht überein.');
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});
