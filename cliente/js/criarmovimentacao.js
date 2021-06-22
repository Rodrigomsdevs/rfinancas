
let idAlterar = parseInt($("#idVer").attr('value'));

$("#formEnviar").submit((e) => {

    e.preventDefault();

    let descricao = $("#descricao").val();
    let tipoMovimentacao = $("#tipoMovimentacao").val();
    let debOuCred = $("#selectDeb :selected").val();
    let data = $("#data_mov").val();
    let aa = $("#valor").val().replace('R$', '');
    aa = aa.replace('.', '');
    aa = aa.replace(',', '.');
    let valor = parseFloat(aa);

    if (!valor || !descricao || !tipoMovimentacao || !data) {
        Swal.fire({
            title: 'Informação',
            text: "Preencha todos os campos!",
            type: "info"
        });
        return;
    }

    $.ajax({
        url: "/api/criar/movimentacao",
        method: 'POST',
        dataType: 'json',
        data: {
            'id': idAlterar,
            'descricao': descricao,
            'tipoMovimentacao': tipoMovimentacao,
            'debitoOuCredito': debOuCred,
            'valor': valor,
            'tipoMovimentacao': tipoMovimentacao,
            'data': data
        },
        success: (result) => {
            if (result.retorno) {

                Swal.fire({
                    title: 'Sucesso',
                    text: result.retorno,
                    type: "success"
                });

                setTimeout(() => {
                    window.location.href = "/user/movimentacao";
                }, 2000);

            } else {

                let msg = result.msg ? result.msg : "";

                Swal.fire({
                    title: 'Ocorreu um erro!',
                    text: msg,
                    type: "error"
                });
            }
        }
    });

});


$("#data_mov").datepicker({
    language: 'br',
    dateFormat: 'yyyy-mm-dd',
    firstDay: 1
});

if (idAlterar > 0) {
    $.ajax({
        url: "/api/getMovimentacoes",
        method: 'POST',
        dataType: 'json',
        success: (result) => {
            if (result.retorno) {

                let movs = result.retorno;
                let find = movs.find(m => m.id == idAlterar);

                $("#descricao").val(find.descricao);
                $("#tipoMovimentacao").val(find.descricaoTipo);
                $("#selectDeb").val(find.tipo);

                $("#valor").val(convertToCurrency(find.valor));
                $("#data_mov").val(dataAtualFormatadaSql(find.data));

                calculateValue();
            } else {
                window.location.href = "/user/movimentacao";
            }
        }
    });
}

var task;

$('#valor').on('blur', (e) => {

    let aa = $(e.target).val().replace('R$', '');
    aa = aa.replace('.', '');
    aa = aa.replace(',', '.');
    aa = aa ? aa : 0;
    let valorR = parseFloat(aa);

    let valor = convertToCurrency(parseFloat(valorR.replace(',', '.')));
    $('#valor').val(valor);

    if(task){
        clearTimeout(task);
    }
});


$("#valor").on('keyup', (e) => {

    let aa = $(e.target).val().replace('R$', '');
    aa = aa.replace('.', '');
    aa = aa.replace(',', '.');
    aa = aa ? aa : 0;
    let valor = parseFloat(aa);

    if(task){
        clearTimeout(task);
    }

    task = setTimeout(() => {
        $('#valor').val(convertToCurrency(valor));
    }, 1000);
});

function calculateValue() {
    var valor = $('#valor').val().replace(',', '.');

    $('#valor').val(convertToCurrency(valor));

}

function convertToCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    })
}

function dataAtualFormatadaSql(data) {
    var data = new Date(data);

    var dia = data.getDate();

    dia = dia.toString();

    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString();
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();

    //return diaF + "/" + mesF + "/" + anoF;
    return anoF + "-" + mesF + "-" + diaF;
}