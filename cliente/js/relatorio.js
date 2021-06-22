$("#emitir").click(() => {

    if(document.getElementById('emitir').disabled){
        return;
    }
    $("#emitir").html(`Emitindo...`);
    document.getElementById('emitir').disabled = !document.getElementById('emitir').disabled;

    $.ajax({
        url: '/api/gerarRelatorio',
        method: 'POST',
        dataType: 'json',
        data: {
            mes: $("#mes").val()
        },
        success: (result) => {

            document.getElementById('emitir').disabled = !document.getElementById('emitir').disabled;
            $("#emitir").html(`Emitir`);

            if (result.nomePdf) {

                Swal.fire({
                    title: "Relatorio gerado!",
                    text: "Você será redirecionado em 1s",
                    type: "success"
                });

                setTimeout(() => {
                    window.open(
                        window.location.origin + result.nomePdf,
                        '_blank' // <- This is what makes it open in a new window.
                    );
                }, 1000);
            }else{
                Swal.fire({
                    title: "Erro!",
                    text: "Erro ao gerar",
                    type: "error"
                });
            }
        }
    });

});

$('#mes').keypress(function(event){

    if($('#mes').val().length >= 2 || (event.which != 8 && isNaN(String.fromCharCode(event.which)))){
        event.preventDefault(); //stop character from entering input
    }

});