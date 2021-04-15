function showToast(state, title, message) {
    $('body')
        .toast({
            class: state,
            title: title,
            message: message,
            showProgress: 'bottom'
        });
}

function doAJAX(vType, vUrl, vData) {
    return $.ajax({
        url: vUrl,
        type: vType,
        data: vData,
        dataType: 'json'
    });
}

$('#addUserBtn').on('click', function () {
    let username = $('#username').val();
    let fullname = $('#fullname').val();
    let email = $('#email').val();
    let admin = $('#admin').val();
    let password = $('#password').val();
    let password2 = $('#password2').val();
    if (username !== '' && fullname !== '' && email !== '' && admin !== '' && password !== '' && password2 !== '' && password === password2) {
        doAJAX('post', '/api/users', {
            username,
            fullname,
            email,
            admin,
            password
        }).done(function (data) {
            if (data.response) {
                showToast('success', null, 'Erfolgreich erstellt');
                $(location).attr('href', '/');
                setTimeout(location.reload.bind(location), 1200);
            } else showToast('error', null, 'Keine valide Serverantwort');
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            showToast('error', 'Fehler (' + data.errorCode + ')', data.error);
        });
    } else if (password !== password2){
        showToast('error', null, 'Die Passwörter stimmen nicht überein.');
    } else {
        showToast('error', null, 'Bitte füllen Sie alle Felder aus.');
    }
});
$('#backBtn').on('click', function () {
    $(location).attr('href', '/login'); // x - mal js und mal jquery für reload..
})
