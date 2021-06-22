$("#formFor").submit((e) => {
    e.preventDefault();

    let action = '/api/forgetpassEmail';
    let valor = 0;
    let id = 0;

    if ($("#email").length > 0) {
        valor = $("#email").val();
    } else {
        valor = $("#senha").val();
        action = '/api/alterarSenha';

        if (getParameterByName('id')) {
            id = getParameterByName('id');
        }
    }

    if (!valor) {
        return;
    }

    $.ajax({
        url: action,
        method: 'POST',
        dataType: 'json',
        data: {
            'email': valor,
            'id': id
        },
        success: (result) => {
            if (result && !result.error) {
                Swal.fire({
                    title: 'Sucesso',
                    text: result.msg,
                    type: "success"
                });

            } else {
                let msg = result.msg ? result.msg : 'erro';
                Swal.fire({
                    title: 'Ocorreu um erro!',
                    text: msg,
                    type: "error"
                });
            }
        }
    });

});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}