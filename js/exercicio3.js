let campoCodigoOrdem = document.getElementById("codigoOrdem");
let campoCodigoProduto = document.getElementById("codigoProduto");
let campoTipoProduto = document.getElementById("tipoProduto");
let campoQuantidadeProduzida = document.getElementById("quantidadeProduzida");
let campoCustoUnitario = document.getElementById("custoUnitario");
let campoEstoqueInicial = document.getElementById("estoqueInicial");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");
let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");
let ordens = [];

botao.addEventListener("click", function () {

    let codigoOrdem = campoCodigoOrdem.value.trim();
    let codigoProduto = campoCodigoProduto.value.trim();
    let tipoProduto = Number(campoTipoProduto.value);
    let quantidadeProduzida = Number(campoQuantidadeProduzida.value);
    let custoUnitario = Number(campoCustoUnitario.value);
    let estoqueInicial = Number(campoEstoqueInicial.value);
    let codigoJaExiste = ordens.some(function (ordem) {
        return ordem.codigoOrdem === codigoOrdem;
    });

    if (codigoOrdem === "" || codigoJaExiste) {
        alert("Código da ordem inválido ou já utilizado.");
        return;
    }

    let custoUnitarioAjustado;
    let nomeTipoProduto;
    let tipoValido = false;

    while (!tipoValido) {

        switch (tipoProduto) {
            case 1:
                custoUnitarioAjustado = custoUnitario;
                nomeTipoProduto = "Padrão";
                tipoValido = true;
                break;
            case 2:
                custoUnitarioAjustado = custoUnitario * 1.10;
                nomeTipoProduto = "Premium";
                tipoValido = true;
                break;
            case 3:
                custoUnitarioAjustado = custoUnitario * 1.20;
                nomeTipoProduto = "Sob encomenda";
                tipoValido = true;
                break;
            default:
                tipoProduto = Number(prompt("Tipo inválido. Digite 1 (Padrão), 2 (Premium) ou 3 (Sob encomenda):"));
        }

    }

    let estoqueFinal = estoqueInicial + quantidadeProduzida;
    let custoTotal = quantidadeProduzida * custoUnitarioAjustado;

    let alerta = "Normal";
    if (estoqueFinal > 5000) {
        alerta = "Alto";
    } else if (estoqueFinal < 500) {
        alerta = "Crítico";
    }

    resultado.textContent =
        "Custo total da ordem: R$ " + custoTotal.toFixed(2) +
        " | Estoque final: " + estoqueFinal +
        " (" + alerta + ")";

    ordens.push({
        codigoOrdem,
        codigoProduto,
        tipoProduto: nomeTipoProduto,
        quantidadeProduzida,
        custoUnitarioAjustado,
        estoqueInicial,
        estoqueFinal,
        custoTotal,
        alerta
    });

    console.log("Ordens até agora:", ordens);

});


botaoRelatorio.addEventListener("click", function () {

    if (ordens.length === 0) {
        campoRelatorio.textContent = "Nenhuma ordem cadastrada ainda.";
        return;
    }

    let totalOrdens = ordens.length;

    let somaCustoTotal = 0;

    let estoquePorTipo = { "Padrão": 0, "Premium": 0, "Sob encomenda": 0 };

    let maiorCusto = ordens[0];
    let menorCusto = ordens[0];

    let qtdAlertaAlto = 0;
    let qtdAlertaCritico = 0;

    let produtos = {};

    ordens.forEach(function (ordem) {

        somaCustoTotal += ordem.custoTotal;

        estoquePorTipo[ordem.tipoProduto] += ordem.estoqueFinal;

        if (ordem.custoTotal > maiorCusto.custoTotal) {
            maiorCusto = ordem;
        }
        if (ordem.custoTotal < menorCusto.custoTotal) {
            menorCusto = ordem;
        }

        if (ordem.alerta === "Alto") {
            qtdAlertaAlto++;
        } else if (ordem.alerta === "Crítico") {
            qtdAlertaCritico++;
        }


        if (!produtos[ordem.codigoProduto]) {
            produtos[ordem.codigoProduto] = {
                estoqueFinal: 0,
                valorInvestido: 0
            };
        }

        produtos[ordem.codigoProduto].estoqueFinal += ordem.estoqueFinal;
        produtos[ordem.codigoProduto].valorInvestido += ordem.custoTotal;

    });

    let mediaCustoTotal = somaCustoTotal / totalOrdens;

    let textoMaiorCusto = maiorCusto.codigoOrdem + " - R$ " + maiorCusto.custoTotal.toFixed(2);
    let textoMenorCusto = menorCusto.codigoOrdem + " - R$ " + menorCusto.custoTotal.toFixed(2);

    let textoPorProduto = "";

    Object.keys(produtos).forEach(function (codigo) {
        let dadosProduto = produtos[codigo];
        textoPorProduto +=
            "<p>Produto " + codigo +
            " — Estoque final: " + dadosProduto.estoqueFinal +
            " | Valor investido: R$ " + dadosProduto.valorInvestido.toFixed(2) +
            "</p>";
    });

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de ordens: " + totalOrdens + "</p>" +
        "<p>Estoque total final - Padrão: " + estoquePorTipo["Padrão"] + "</p>" +
        "<p>Estoque total final - Premium: " + estoquePorTipo["Premium"] + "</p>" +
        "<p>Estoque total final - Sob encomenda: " + estoquePorTipo["Sob encomenda"] + "</p>" +
        "<p>Média de custo total por ordem: R$ " + mediaCustoTotal.toFixed(2) + "</p>" +
        "<p>Ordem com maior custo total: " + textoMaiorCusto + "</p>" +
        "<p>Ordem com menor custo total: " + textoMenorCusto + "</p>" +
        "<p>Ordens com alerta de estoque alto: " + qtdAlertaAlto + "</p>" +
        "<p>Ordens com alerta de estoque crítico: " + qtdAlertaCritico + "</p>" +
        "<h4>Por produto:</h4>" +
        textoPorProduto;

});