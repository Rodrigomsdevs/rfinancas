

$("#formLogin").submit((e) => {
    e.preventDefault();

    let email = $("#email").val();
    let password = $("#password").val();

    fazLogin(email, password);

});


function fazLogin(email, password, time = true) {
    let checkbox = $("#checkbox:checked").length;
    $.ajax({
        url: '/api/login',
        method: 'POST',
        dataType: 'json',
        data: {
            'email': email,
            'password': password,
            'checkbox': checkbox,
        },
        success: (result) => {
            if (result && !result.error) {

                if (!time) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    return;
                }

                Swal.fire({
                    title: result.msg,
                    text: "Você será redirecionado em 2s",
                    type: "success"
                });


                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            }else{
                let msg = result.msg ? result.msg : 'erro';

                Swal.fire({
                    title: 'Ocorreu um erro!',
                    text: msg,
                    type: "error"
                });
            }
        }
    });
}