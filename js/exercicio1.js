let campoPreco = document.getElementById("precoCombustivel");
let campoCodigo = document.getElementById("codigoPedido");
let campoRegiao = document.getElementById("regiao");
let campoDistancia = document.getElementById("distancia");
let campoQuantidade = document.getElementById("quantidadePecas");
let campoRastreamento = document.getElementById("rastreamento");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");
let pedidos = [];

botao.addEventListener("click", function () {

    let codigo = campoCodigo.value.trim();
    let preco = Number(campoPreco.value);
    let regiao = Number(campoRegiao.value);
    let distancia = Number(campoDistancia.value);
    let quantidade = Number(campoQuantidade.value);
    let temRastreamento = campoRastreamento.checked;
    let codigoJaExiste = pedidos.some(function (pedido) {
        return pedido.codigo === codigo;
    });

    if (codigo === "" || codigoJaExiste) {
        alert("Código inválido ou já utilizado. Digite um código único.");
        return;
    }

    let precoPeca;
    let regiaoValida = false;

    while (!regiaoValida) {

        switch (regiao) {
            case 1:
                precoPeca = 1.20;
                regiaoValida = true;
                break;
            case 2:
                precoPeca = 1.30;
                regiaoValida = true;
                break;
            case 3:
                precoPeca = 1.50;
                regiaoValida = true;
                break;
            default:
                regiao = Number(prompt("Região inválida. Digite 1 (Sudeste), 2 (Sul) ou 3 (Centro-Oeste):"));
        }

    }

    let valorPecas;

    if (quantidade > 1000) {
        let excedente = quantidade - 1000;
        let valorBase = 1000 * precoPeca;
        let valorExcedente = excedente * precoPeca * 0.88;
        valorPecas = valorBase + valorExcedente;
    } else {
        valorPecas = quantidade * precoPeca;
    }

    let custoFrete = preco * distancia;
    let valorRastreamento = temRastreamento ? 200 : 0;
    let custoTotal = custoFrete + valorPecas + valorRastreamento;

    resultado.textContent =
        "Valor total do pedido: R$ " + custoTotal.toFixed(2);

    pedidos.push({
        codigo: codigo,
        regiao: regiao,
        total: custoTotal
    });

    console.log("Pedidos até agora:", pedidos);

});

let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");

botaoRelatorio.addEventListener("click", function () {

    if (pedidos.length === 0) {
        campoRelatorio.textContent = "Nenhum pedido cadastrado ainda.";
        return;
    }

    let totalPedidos = pedidos.length;
    let somaTotal = 0;
    let totalPorRegiao = { 1: 0, 2: 0, 3: 0 };
    let maisCaro = pedidos[0];
    let maisBarato = pedidos[0];

    pedidos.forEach(function (pedido) {
        somaTotal += pedido.total;
        totalPorRegiao[pedido.regiao] += pedido.total;

        if (pedido.total > maisCaro.total) {
            maisCaro = pedido;
        }

        if (pedido.total < maisBarato.total) {
            maisBarato = pedido;
        }
    });

    let valorMedio = somaTotal / totalPedidos;

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de pedidos: " + totalPedidos + "</p>" +
        "<p>Valor médio por pedido: R$ " + valorMedio.toFixed(2) + "</p>" +
        "<p>Total região Sudeste: R$ " + totalPorRegiao[1].toFixed(2) + "</p>" +
        "<p>Total região Sul: R$ " + totalPorRegiao[2].toFixed(2) + "</p>" +
        "<p>Total região Centro-Oeste: R$ " + totalPorRegiao[3].toFixed(2) + "</p>" +
        "<p>Pedido mais caro: " + maisCaro.codigo + " (R$ " + maisCaro.total.toFixed(2) + ")</p>" +
        "<p>Pedido mais barato: " + maisBarato.codigo + " (R$ " + maisBarato.total.toFixed(2) + ")</p>";

});