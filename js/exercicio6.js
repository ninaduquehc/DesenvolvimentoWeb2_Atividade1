let campoMetaMensal = document.getElementById("metaMensal");
let campoPercentualBase = document.getElementById("percentualBase");
let campoCodigoVenda = document.getElementById("codigoVenda");
let campoCodigoVendedor = document.getElementById("codigoVendedor");
let campoRegiaoLoja = document.getElementById("regiaoLoja");
let campoValorVenda = document.getElementById("valorVenda");
let campoTipoCliente = document.getElementById("tipoCliente");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");

let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");

let vendas = [];

botao.addEventListener("click", function () {

    let metaMensal = Number(campoMetaMensal.value);
    let percentualBase = Number(campoPercentualBase.value) / 100;

    let codigoVenda = campoCodigoVenda.value.trim();
    let codigoVendedor = campoCodigoVendedor.value.trim();
    let regiaoLoja = Number(campoRegiaoLoja.value);
    let valorVenda = Number(campoValorVenda.value);
    let tipoCliente = campoTipoCliente.value.trim().toUpperCase();

    let codigoJaExiste = vendas.some(function (venda) {
        return venda.codigoVenda === codigoVenda;
    });

    if (codigoVenda === "" || codigoJaExiste) {
        alert("Código da venda inválido ou já utilizado.");
        return;
    }

    let bonusRegiao;
    let nomeRegiao;
    let regiaoValida = false;

    while (!regiaoValida) {
        switch (regiaoLoja) {
            case 1:
                bonusRegiao = 0.01;
                nomeRegiao = "Norte";
                regiaoValida = true;
                break;
            case 2:
                bonusRegiao = 0.01;
                nomeRegiao = "Nordeste";
                regiaoValida = true;
                break;
            case 3:
                bonusRegiao = 0;
                nomeRegiao = "Sudeste";
                regiaoValida = true;
                break;
            case 4:
                bonusRegiao = 0.005;
                nomeRegiao = "Sul";
                regiaoValida = true;
                break;
            default:
                regiaoLoja = Number(prompt("Região inválida. Digite 1 (Norte), 2 (Nordeste), 3 (Sudeste) ou 4 (Sul):"));
        }
    }
    campoRegiaoLoja.value = regiaoLoja;

    let bonusCliente;
    let tipoValido = false;

    while (!tipoValido) {
        switch (tipoCliente) {
            case "PF":
                bonusCliente = 0.02;
                tipoValido = true;
                break;
            case "PJ":
                bonusCliente = 0.03;
                tipoValido = true;
                break;
            default:
                tipoCliente = prompt("Tipo inválido. Digite PF ou PJ:").toUpperCase();
        }
    }
    campoTipoCliente.value = tipoCliente;

    let comissaoBase = valorVenda * percentualBase;
    let comissaoTotal = comissaoBase + (valorVenda * bonusCliente) + (valorVenda * bonusRegiao);

    resultado.textContent =
        "Venda " + codigoVenda + " cadastrada! Comissão: R$ " + comissaoTotal.toFixed(2);

    vendas.push({
        codigoVenda,
        codigoVendedor,
        regiao: nomeRegiao,
        valorVenda,
        tipoCliente,
        comissaoTotal
    });

    console.log("Vendas até agora:", vendas);

});


botaoRelatorio.addEventListener("click", function () {

    if (vendas.length === 0) {
        campoRelatorio.textContent = "Nenhuma venda cadastrada ainda.";
        return;
    }

    let metaMensal = Number(campoMetaMensal.value);

    let totalVendas = vendas.length;
    let somaComissaoGeral = 0;

    let valorPorRegiao = { "Norte": 0, "Nordeste": 0, "Sudeste": 0, "Sul": 0 };
    let valorPorCliente = { "PF": 0, "PJ": 0 };
    let somaComissaoPorRegiao = { "Norte": 0, "Nordeste": 0, "Sudeste": 0, "Sul": 0 };
    let qtdVendasPorRegiao = { "Norte": 0, "Nordeste": 0, "Sudeste": 0, "Sul": 0 };

    let vendedores = {};

    vendas.forEach(function (venda) {

        somaComissaoGeral += venda.comissaoTotal;

        valorPorRegiao[venda.regiao] += venda.valorVenda;
        valorPorCliente[venda.tipoCliente] += venda.valorVenda;

        somaComissaoPorRegiao[venda.regiao] += venda.comissaoTotal;
        qtdVendasPorRegiao[venda.regiao]++;

        if (!vendedores[venda.codigoVendedor]) {
            vendedores[venda.codigoVendedor] = {
                codigo: venda.codigoVendedor,
                totalVendido: 0,
                comissaoTotal: 0
            };
        }
        vendedores[venda.codigoVendedor].totalVendido += venda.valorVenda;
        vendedores[venda.codigoVendedor].comissaoTotal += venda.comissaoTotal;

    });

    let listaVendedores = Object.keys(vendedores).map(function (codigo) {
        return vendedores[codigo];
    });

    let maiorVendedor = listaVendedores[0];
    let maiorComissaoVendedor = listaVendedores[0];
    let qtdBateuMeta = 0;

    listaVendedores.forEach(function (vendedor) {
        if (vendedor.totalVendido > maiorVendedor.totalVendido) {
            maiorVendedor = vendedor;
        }
        if (vendedor.comissaoTotal > maiorComissaoVendedor.comissaoTotal) {
            maiorComissaoVendedor = vendedor;
        }
        if (vendedor.totalVendido >= metaMensal) {
            qtdBateuMeta++;
        }
    });

    let comissaoMediaGeral = somaComissaoGeral / totalVendas;

    let comissaoMediaNorte = qtdVendasPorRegiao["Norte"] > 0 ? somaComissaoPorRegiao["Norte"] / qtdVendasPorRegiao["Norte"] : 0;
    let comissaoMediaNordeste = qtdVendasPorRegiao["Nordeste"] > 0 ? somaComissaoPorRegiao["Nordeste"] / qtdVendasPorRegiao["Nordeste"] : 0;
    let comissaoMediaSudeste = qtdVendasPorRegiao["Sudeste"] > 0 ? somaComissaoPorRegiao["Sudeste"] / qtdVendasPorRegiao["Sudeste"] : 0;
    let comissaoMediaSul = qtdVendasPorRegiao["Sul"] > 0 ? somaComissaoPorRegiao["Sul"] / qtdVendasPorRegiao["Sul"] : 0;

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de vendas registradas: " + totalVendas + "</p>" +
        "<p>Valor vendido - Norte: R$ " + valorPorRegiao["Norte"].toFixed(2) + "</p>" +
        "<p>Valor vendido - Nordeste: R$ " + valorPorRegiao["Nordeste"].toFixed(2) + "</p>" +
        "<p>Valor vendido - Sudeste: R$ " + valorPorRegiao["Sudeste"].toFixed(2) + "</p>" +
        "<p>Valor vendido - Sul: R$ " + valorPorRegiao["Sul"].toFixed(2) + "</p>" +
        "<p>Valor vendido - Pessoa Física: R$ " + valorPorCliente["PF"].toFixed(2) + "</p>" +
        "<p>Valor vendido - Pessoa Jurídica: R$ " + valorPorCliente["PJ"].toFixed(2) + "</p>" +
        "<p>Vendedor com maior valor vendido: " + maiorVendedor.codigo + " (R$ " + maiorVendedor.totalVendido.toFixed(2) + ")</p>" +
        "<p>Vendedor com maior comissão: " + maiorComissaoVendedor.codigo + " (R$ " + maiorComissaoVendedor.comissaoTotal.toFixed(2) + ")</p>" +
        "<p>Vendedores que bateram a meta: " + qtdBateuMeta + "</p>" +
        "<p>Comissão média geral: R$ " + comissaoMediaGeral.toFixed(2) + "</p>" +
        "<h4>Comissão média por região</h4>" +
        "<p>Norte: R$ " + comissaoMediaNorte.toFixed(2) + "</p>" +
        "<p>Nordeste: R$ " + comissaoMediaNordeste.toFixed(2) + "</p>" +
        "<p>Sudeste: R$ " + comissaoMediaSudeste.toFixed(2) + "</p>" +
        "<p>Sul: R$ " + comissaoMediaSul.toFixed(2) + "</p>";

});