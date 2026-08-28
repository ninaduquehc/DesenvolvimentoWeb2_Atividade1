let campoValorBase = document.getElementById("valorBase");
let campoValorCafe = document.getElementById("valorCafe");
let campoCodigoReserva = document.getElementById("codigoReserva");
let campoTipoQuarto = document.getElementById("tipoQuarto");
let campoTemporada = document.getElementById("temporada");
let campoDiarias = document.getElementById("diarias");
let campoHospedes = document.getElementById("hospedes");
let campoCafeIncluso = document.getElementById("cafeIncluso");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");

let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");

let reservas = [];

botao.addEventListener("click", function () {

    let valorBase = Number(campoValorBase.value);
    let valorCafe = Number(campoValorCafe.value);

    let codigoReserva = campoCodigoReserva.value.trim();
    let tipoQuarto = campoTipoQuarto.value.trim().toUpperCase();
    let temporada = campoTemporada.value.trim().toUpperCase();
    let diarias = Number(campoDiarias.value);
    let hospedes = Number(campoHospedes.value);
    let cafeIncluso = campoCafeIncluso.value.trim().toUpperCase();

    let codigoJaExiste = reservas.some(function (reserva) {
        return reserva.codigoReserva === codigoReserva;
    });

    if (codigoReserva === "" || codigoJaExiste) {
        alert("Código da reserva inválido ou já utilizado.");
        return;
    }

    let multiplicadorQuarto;
    let nomeTipoQuarto;
    let tipoValido = false;

    while (!tipoValido) {
        switch (tipoQuarto) {
            case "S":
                multiplicadorQuarto = 1.00;
                nomeTipoQuarto = "Standard";
                tipoValido = true;
                break;
            case "L":
                multiplicadorQuarto = 1.50;
                nomeTipoQuarto = "Luxo";
                tipoValido = true;
                break;
            case "P":
                multiplicadorQuarto = 2.00;
                nomeTipoQuarto = "Premium";
                tipoValido = true;
                break;
            default:
                tipoQuarto = prompt("Tipo inválido. Digite S (Standard), L (Luxo) ou P (Premium):").toUpperCase();
                campoTipoQuarto.value = tipoQuarto;
        }
    }

    let acrescimoTemporada;
    let nomeTemporada;
    let temporadaValida = false;

    while (!temporadaValida) {
        switch (temporada) {
            case "B":
                acrescimoTemporada = 0;
                nomeTemporada = "Baixa";
                temporadaValida = true;
                break;
            case "A":
                acrescimoTemporada = 0.25;
                nomeTemporada = "Alta";
                temporadaValida = true;
                break;
            case "F":
                acrescimoTemporada = 0.40;
                nomeTemporada = "Feriado";
                temporadaValida = true;
                break;
            default:
                temporada = prompt("Temporada inválida. Digite B (Baixa), A (Alta) ou F (Feriado):").toUpperCase();
                campoTemporada.value = temporada;
        }
    }

    while (cafeIncluso !== "S" && cafeIncluso !== "N") {
        cafeIncluso = prompt("Valor inválido. Café incluso? Digite S ou N:").toUpperCase();
    }
    campoCafeIncluso.value = cafeIncluso;
    let temCafe = cafeIncluso === "S";

    let valorDiariaAjustada = valorBase * multiplicadorQuarto;
    let valorDiariaFinal = valorDiariaAjustada * (1 + acrescimoTemporada);

    let cafeTotal = temCafe ? (valorCafe * hospedes * diarias) : 0;

    let valorTotal = (valorDiariaFinal * diarias) + cafeTotal;

    resultado.textContent =
        "Valor total da reserva: R$ " + valorTotal.toFixed(2);

    reservas.push({
        codigoReserva,
        tipoQuarto: nomeTipoQuarto,
        temporada: nomeTemporada,
        diarias,
        hospedes,
        temCafe,
        valorTotal
    });

    console.log("Reservas até agora:", reservas);

});


botaoRelatorio.addEventListener("click", function () {

    if (reservas.length === 0) {
        campoRelatorio.textContent = "Nenhuma reserva cadastrada ainda.";
        return;
    }

    let totalReservas = reservas.length;
    let somaValorTotal = 0;

    let valorPorTipo = { "Standard": 0, "Luxo": 0, "Premium": 0 };
    let valorPorTemporada = { "Baixa": 0, "Alta": 0, "Feriado": 0 };

    let maisCara = reservas[0];
    let maisBarata = reservas[0];

    let qtdComCafe = 0;
    let qtdSemCafe = 0;

    let ocupacaoTotal = 0;

    reservas.forEach(function (reserva) {

        somaValorTotal += reserva.valorTotal;

        valorPorTipo[reserva.tipoQuarto] += reserva.valorTotal;
        valorPorTemporada[reserva.temporada] += reserva.valorTotal;

        if (reserva.valorTotal > maisCara.valorTotal) {
            maisCara = reserva;
        }
        if (reserva.valorTotal < maisBarata.valorTotal) {
            maisBarata = reserva;
        }

        if (reserva.temCafe) {
            qtdComCafe++;
        } else {
            qtdSemCafe++;
        }

    });

    let valorMedio = somaValorTotal / totalReservas;

    let valorMedioPorHospede = somaValorTotal / ocupacaoTotal;

    let textoMaisCara = maisCara.codigoReserva + " (" + maisCara.tipoQuarto + "/" + maisCara.temporada + ", " + maisCara.hospedes + " hóspedes) - R$ " + maisCara.valorTotal.toFixed(2);
    let textoMaisBarata = maisBarata.codigoReserva + " (" + maisBarata.tipoQuarto + "/" + maisBarata.temporada + ", " + maisBarata.hospedes + " hóspedes) - R$ " + maisBarata.valorTotal.toFixed(2);

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de reservas: " + totalReservas + "</p>" +
        "<p>Valor médio por reserva: R$ " + valorMedio.toFixed(2) + "</p>" +
        "<p>Valor total - Standard: R$ " + valorPorTipo["Standard"].toFixed(2) + "</p>" +
        "<p>Valor total - Luxo: R$ " + valorPorTipo["Luxo"].toFixed(2) + "</p>" +
        "<p>Valor total - Premium: R$ " + valorPorTipo["Premium"].toFixed(2) + "</p>" +
        "<p>Valor total - Baixa temporada: R$ " + valorPorTemporada["Baixa"].toFixed(2) + "</p>" +
        "<p>Valor total - Alta temporada: R$ " + valorPorTemporada["Alta"].toFixed(2) + "</p>" +
        "<p>Valor total - Feriado: R$ " + valorPorTemporada["Feriado"].toFixed(2) + "</p>" +
        "<p>Reserva mais cara: " + textoMaisCara + "</p>" +
        "<p>Reserva mais barata: " + textoMaisBarata + "</p>" +
        "<p>Reservas com café incluso: " + qtdComCafe + "</p>" +
        "<p>Reservas sem café: " + qtdSemCafe + "</p>" +
        "<p>Ocupação total (diárias × hóspedes): " + ocupacaoTotal + "</p>" +
        "<p>Valor médio por hóspede: R$ " + valorMedioPorHospede.toFixed(2) + "</p>";

});