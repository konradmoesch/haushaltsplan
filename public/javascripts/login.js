$(document).ready(function() {
    // form validation
    $('.ui.form').form({
        fields: {
            username: {
                identifier  : 'username',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your username'
                    }
                ]
            },
            password: {
                identifier  : 'password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your password'
                    }
                ]
            }
        }
    });
});

// login function
function login() {
    let username = $('#login-username'), pw = $('#login-password');
    if (pw.val().trim() === '' || username.val().trim() === '') {
        $('#errorbox').html('<div class="ui negative message"><p>Es wurden nicht alle Felder ausgefüllt.</p></div>');
    } else {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {username: username.val(), password: pw.val()},
            dataType: 'json'
        }).done(function () {
            window.location.replace("/");
        }).fail(function (xhr) {
            let data = xhr.responseJSON;
            $('#form').removeClass('success').addClass('error');
            $('#errorbox').html('<p>' + data.error + '</p>');
            pw.val('');
        });
    }
}

// animation & enter key hook
$(function () {
    $(".login-form").animate({left: '60%'}, 'slow');
    $('#login-submit').on('click', function () {
        login();
    });
    $('input').on('keyup', function (e) {
        if (e.key === 'Enter') {
            login();
        }
    });
});