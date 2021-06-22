loadTable();
let totalCreditos = 0, totalDebitos = 0;
function loadTable() {
    $.ajax({
        url: "/api/getMovimentacoes",
        method: 'POST',
        dataType: 'json',
        success: (result) => {

            $("#tableBody > tr").remove();
            if (result.retorno) {


                result.retorno.forEach((item) => {
                    $("#tableBody").append(`
                    <tr>
                        <td>${item.id}</td>    
                        <td class="note ${item.tipo == 'C' ? 'info' : 'warning'}">${item.tipo == 'C' ? 'Credito' : 'Debito'}</td>    
                        <td>${item.descricao}</td>    
                        <td>${convertToCurrency(item.valor)}</td>    
                        <td>${dataAtualFormatadaSql(item.data)}</td>    
                        <td>
                        <a href="javascript:;" onclick="alterar(${item.id})" class="btn">Alterar</a>
                        <a href="javascript:;" onclick="excluir(${item.id})" class="btn">Excluir</a>
                        </td>   
                        </tr>
                    `);

                    if (item.tipo == 'C') {
                        totalCreditos += item.valor;
                    } else {
                        totalDebitos += item.valor;
                    }
                });

                $("#debitosTotal").html(convertToCurrency(totalDebitos));
                $("#creditosTotal").html(convertToCurrency(totalCreditos));
            }
        }
    });
}

function alterar(id) {

    window.location.href = "/user/criar/movimentacao/" + id;

}

function excluir(id) {

    $.ajax({
        url: '/api/deletarMovimentacao',
        method: 'DELETE',
        dataType: 'json',
        data: {
            'id': id
        },
        success: (result) => {

            if (result.retorno) {
                Swal.fire({
                    title: 'Sucesso',
                    text: result.retorno,
                    type: "success"
                });

                loadTable();
            } else {
                let msg = result.msg ? result.msg : "";

                Swal.fire({
                    title: 'Sucesso',
                    text: msg,
                    type: "error"
                });
            }

        }
    });

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

    return diaF + "/" + mesF + "/" + anoF;
}