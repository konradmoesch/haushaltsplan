$.ajaxSetup({
    statusCode: {
        401: () => window.top.location.href = '/login'
    }
});

function doAJAX(vType, vUrl, vData) {
    return $.ajax({
        url: vUrl,
        type: vType,
        data: vData,
        dataType: 'json'
    });
}

function showToast(vType, vText, vError = '') {
    let colorClass = '';
    let iconFa = '';
    switch (vType) {
        case 'success':
            colorClass = 'green';
            iconFa = 'check';
            break;
        case 'warning':
            colorClass = 'orange';
            iconFa = 'exclamation';
            break;
        case 'error':
            colorClass = 'red';
            iconFa = 'exclamation triangle';
            break;
        case 'info':
            colorClass = 'blue';
            iconFa = 'info';
            break;
    }
    vError = (vError) ? '<pre>' + vError + '</pre>' : '';
    $('#notification').append('<div class="ui icon transition message ' + colorClass + '"><i class="' + iconFa + ' icon"></i><i onclick="$(this).parent().remove();" class="close icon"></i><div class="content"><p>' + vText + '</p>' + vError + '</div></div>');
    $('#notification :last-child').fadeIn().delay(3000).fadeOut(1000, () => {
        $(this).remove();
    });
}

/*
//datatable defaults
$.extend(true, $.fn.DataTable.defaults, {
    destroy: true,
    language: {
        'sEmptyTable': 'Keine Daten in der Tabelle vorhanden',
        'sInfo': 'Zeige <strong>_START_</strong> bis <strong>_END_</strong> von ingesamt <strong>_TOTAL_</strong> Einträgen',
        'sInfoEmpty': 'keine Einträge',
        'sInfoFiltered': '(gefiltert von <strong>_MAX_</strong> Einträgen)',
        'sInfoPostFix': '',
        'sInfoThousands': '.',
        'sLengthMenu': '_MENU_ Einträge pro Seite',
        'sLoadingRecords': '<i class="notched circle loading icon"></i>',
        'sProcessing': '<i class="notched circle loading icon"></i>',
        'sSearch': '',
        'sSearchPlaceholder': 'Suche',
        'sZeroRecords': 'Keine Einträge vorhanden.',
        'oPaginate': {
            'sPrevious': '<i class="chevron left icon"></i>',
            'sNext': '<i class="chevron right icon"></i>',
        }
    },
    paginate: true,
    dom: '<"top"<"ui grid"<"two wide column"B><"three wide column"l><"eight wide column"p><"three wide column"f>><"clear">>rt<"bottom"<"ui grid"<"eight wide column"i><"eight wide column"p>><"clear">>',
    buttons: [
        {
            text: '<i class="sync icon"></i>',
            action(e, dt) {
                dt.ajax.reload();
            }
        },
        {
            text: '<i class="hashtag icon"></i>',
            action(e, dt) {
                (dt.columns().visible()[0] === true ? dt.columns(0).visible(false) : dt.columns(0).visible(true));
            }
        }
    ]
});
$.fn.DataTable.ext.type.search.string = function (data) {
    if (!data) {
        return '';
    } else if (typeof data === 'string') {
        let diacriticsMap = {
            A: /[\u00C0\u00C1\u00C2]/g, C: /[\u00C7\u0106\u0108]/g, E: /[\u00C8\u00C9\u00CA\u00CB]/g,
            I: /[\u00CC\u00CD\u00CE\u00CF]/g, O: /[\u00D0\u00D3\u00D4]/g, U: /[\u00D9\u00DA\u00DB]/g,
            a: /[\u00E0\u00E1\u00E2]/g, c: /[\u00e7\u0107\u0109]/g, e: /[\u00E8\u00E9\u00EA\u00EB]/g,
            i: /[\u00EC\u00ED\u00EE\u00EF]/g, o: /[\u00F2\u00F3\u00F4]/g, u: /[\u00F9\u00FA\u00FB]/g,
        };
        for (let x in diacriticsMap) {
            if ({}.hasOwnProperty.call(diacriticsMap, x)) {
                data = data.replace(diacriticsMap[x], x);
            }
        }
    }
    return data;
};
$.fn.DataTable.ext.order.intl = function (locales, options) {
    if (window.Intl) {
        let collator = new window.Intl.Collator(locales, options);
        let types = $.fn.DataTable.ext.type;
        delete types.order['string-pre'];
        types.order['string-asc'] = collator.compare;
        types.order['string-desc'] = function (a, b) {
            return collator.compare(a, b) * -1;
        };
    }
};
$.fn.DataTable.ext.order.intl('de');

//reload datatable
function reloadDT(table) {
    $(table).DataTable().ajax.reload();
}

function dtAddSearch(table) {
    table.columns().every(function () {
        let that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
}

//get URL parameter
function getParameterByName(name) {
    let url = new URL(location.href);
    return url.searchParams.get(name);
}*/
