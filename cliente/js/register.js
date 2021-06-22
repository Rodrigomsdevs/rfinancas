$("#formRegister").submit((e) => {
    e.preventDefault();


    let nome = $("#nome").val();
    let sobrenome = $("#sobrenome").val();
    let email = $("#email").val();
    let senha = $("#senha").val();
    let confirmacao_senha = $("#r_senha").val();

    if (!(senha == confirmacao_senha)) {
        return;
    }

    $.ajax({
        url: '/api/register',
        method: 'POST',
        dataType: 'json',
        data: {
            'nome': nome,
            'sobrenome': sobrenome,
            'email': email,
            'senha': senha
        },

        //git config --global user.email "you@example.com"
       // git config --global user.name "Your Name"
        success: (result) => {
            if (result && !result.error) {

                Swal.fire({
                    title: 'Você será redirecionado em 3s',
                    text: result.msg,
                    type: "success"
                });

                setTimeout(() => {
                    window.location.href = "/user/login";
                }, 2500);


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