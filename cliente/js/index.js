$.ajax({
    url: "/api/getMovimentacoes",
    method: 'POST',
    dataType: 'json',
    success: (result) => {
        if (result.retorno) {

            let datas = [];
            let debitos = [];
            let creditos = [];
            let valorDebito = 0, valorCredito = 0;

            result.retorno.forEach((item) => {

                var dataFormatada = dataAtualFormatada(item.data);

                if (datas.indexOf(dataFormatada) > -1) {

                    if (item.tipo.toLowerCase() == 'd') {
                        valorDebito += item.valor;
                        debitos[debitos.length - 1] += item.valor;
                    }else{
                        valorCredito += item.valor;
                        creditos[creditos.length - 1] += item.valor;
                    }

                } else {
                    datas.push(dataFormatada);

                    if (item.tipo.toLowerCase() == 'd') {
                        creditos.push(0);
                        debitos.push(item.valor);
                        valorDebito += item.valor;
                    } else {
                        debitos.push(0);
                        creditos.push(item.valor);
                        valorCredito += item.valor;
                    }
                }

            });

            $("#debitosTotal").html(convertToCurrency(valorDebito));
            $("#creditosTotal").html(convertToCurrency(valorCredito));

            let porcentagem = parseInt(((valorDebito * 100) / valorCredito));
            $("#porcentMov").html(`${porcentagem}<sup>%</sup>`);

            if (debitos.length > creditos.length) {
                let diferenca = debitos.length - creditos.length;

                for (var i = 0; i < diferenca; i++) {
                    creditos.push(0);
                }
            }

            if (creditos.length > debitos.length) {
                let diferenca = creditos.length - debitos.length;

                for (var i = 0; i < diferenca; i++) {
                    debitos.push(0);
                }
            }

            var options = {
                chart: {
                    type: "area",
                    height: 112,
                    sparkline: {
                        enabled: true
                    }
                },
                stroke: {
                    curve: "smooth",
                    width: 2
                },
                fill: {
                    opacity: .05
                },
                series: [{
                    name: 'Debito',
                    data: debitos
                }, {
                    name: 'Credito',
                    data: creditos
                }],
                labels: datas,
                yaxis: {
                    min: 0
                },
                colors: ["#09D1DE", "#E580FD"],
                grid: {
                    row: {
                        colors: ['transparent', 'transparent'], opacity: .2
                    },
                    padding: {
                        top: 5,
                    },
                    borderColor: 'transparent'
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                }
            }
            var area2_Chart = new ApexCharts(document.querySelector("#apex_area2-chart"), options);
            area2_Chart.render();
        }
    }
});



function dataAtualFormatada(data) {
    var data = new Date(data);

    var dia = data.getDate();

    dia = dia.toString();

    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString();
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();

    //return diaF + "/" + mesF + "/" + anoF;
    return diaF + "/" + mesF + "/" + anoF;
}

function convertToCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    })
}