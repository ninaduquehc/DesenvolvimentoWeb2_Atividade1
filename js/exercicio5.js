let campoCargaMaxima = document.getElementById("cargaMaxima");
let campoCodigoTreino = document.getElementById("codigoTreino");
let campoNomeJogador = document.getElementById("nomeJogador");
let campoPosicao = document.getElementById("posicao");
let campoTipoTreino = document.getElementById("tipoTreino");
let campoDuracao = document.getElementById("duracao");
let campoIntensidade = document.getElementById("intensidade");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");

let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");

let treinos = [];

botao.addEventListener("click", function () {

    let cargaMaxima = Number(campoCargaMaxima.value);
    let codigoTreino = campoCodigoTreino.value.trim();
    let nomeJogador = campoNomeJogador.value.trim();
    let posicao = campoPosicao.value.trim().toUpperCase();
    let tipoTreino = campoTipoTreino.value.trim().toUpperCase();
    let duracao = Number(campoDuracao.value);
    let intensidade = Number(campoIntensidade.value);

    let codigoJaExiste = treinos.some(function (treino) {
        return treino.codigoTreino === codigoTreino;
    });

    if (codigoTreino === "" || codigoJaExiste) {
        alert("Código do treino inválido ou já utilizado.");
        return;
    }

    let nomePosicao;
    let posicaoValida = false;

    while (!posicaoValida) {
        switch (posicao) {
            case "G":
                nomePosicao = "Goleiro";
                posicaoValida = true;
                break;
            case "Z":
                nomePosicao = "Zagueiro";
                posicaoValida = true;
                break;
            case "M":
                nomePosicao = "Meio-campo";
                posicaoValida = true;
                break;
            case "A":
                nomePosicao = "Atacante";
                posicaoValida = true;
                break;
            default:
                posicao = prompt("Posição inválida. Digite G, Z, M ou A:").toUpperCase();
        }
    }
    campoPosicao.value = posicao;

    let multiplicadorTipo;
    let nomeTipoTreino;
    let tipoValido = false;

    while (!tipoValido) {
        switch (tipoTreino) {
            case "F":
                multiplicadorTipo = 1.5;
                nomeTipoTreino = "Físico";
                tipoValido = true;
                break;
            case "T":
                multiplicadorTipo = 1.2;
                nomeTipoTreino = "Técnico";
                tipoValido = true;
                break;
            case "E":
                multiplicadorTipo = 1.0;
                nomeTipoTreino = "Estratégico";
                tipoValido = true;
                break;
            default:
                tipoTreino = prompt("Tipo inválido. Digite F, T ou E:").toUpperCase();
        }
    }
    campoTipoTreino.value = tipoTreino;

    while (intensidade < 1 || intensidade > 10 || isNaN(intensidade)) {
        intensidade = Number(prompt("Intensidade inválida. Digite um valor entre 1 e 10:"));
    }
    campoIntensidade.value = intensidade;

    let carga = (duracao / 10) * intensidade * multiplicadorTipo;

    resultado.textContent =
        "Treino " + codigoTreino + " cadastrado! Carga: " + carga.toFixed(2);

    treinos.push({
        codigoTreino,
        nomeJogador,
        posicao: nomePosicao,
        tipoTreino: nomeTipoTreino,
        duracao,
        intensidade,
        carga
    });

    console.log("Treinos até agora:", treinos);

});


botaoRelatorio.addEventListener("click", function () {

    if (treinos.length === 0) {
        campoRelatorio.textContent = "Nenhum treino cadastrado ainda.";
        return;
    }

    let cargaMaxima = Number(campoCargaMaxima.value);

    let totalTreinos = treinos.length;

    let jogadores = {};

    let somaPorTipo = { "Físico": 0, "Técnico": 0, "Estratégico": 0 };
    let qtdPorTipo = { "Físico": 0, "Técnico": 0, "Estratégico": 0 };

    let qtdPorPosicao = { "Goleiro": 0, "Zagueiro": 0, "Meio-campo": 0, "Atacante": 0 };
    let somaCargaPorPosicao = { "Goleiro": 0, "Zagueiro": 0, "Meio-campo": 0, "Atacante": 0 };

    treinos.forEach(function (treino) {

        if (!jogadores[treino.nomeJogador]) {
            jogadores[treino.nomeJogador] = {
                nome: treino.nomeJogador,
                posicao: treino.posicao,
                cargaTotal: 0,
                qtdTreinos: 0
            };
        }
        jogadores[treino.nomeJogador].cargaTotal += treino.carga;
        jogadores[treino.nomeJogador].qtdTreinos++;

        somaPorTipo[treino.tipoTreino] += treino.carga;
        qtdPorTipo[treino.tipoTreino]++;

        qtdPorPosicao[treino.posicao]++;
        somaCargaPorPosicao[treino.posicao] += treino.carga;

    });

    let listaJogadores = Object.keys(jogadores).map(function (nome) {
        return jogadores[nome];
    });

    let maiorCarga = listaJogadores[0];
    let menorCarga = listaJogadores[0];
    let qtdRisco = 0;

    listaJogadores.forEach(function (jogador) {
        if (jogador.cargaTotal > maiorCarga.cargaTotal) {
            maiorCarga = jogador;
        }
        if (jogador.cargaTotal < menorCarga.cargaTotal) {
            menorCarga = jogador;
        }
        if (jogador.cargaTotal > cargaMaxima) {
            qtdRisco++;
        }
    });

    let textoJogadores = "";
    listaJogadores.forEach(function (jogador) {
        let risco = jogador.cargaTotal > cargaMaxima ? " ⚠ risco de lesão" : "";
        textoJogadores +=
            "<p>" + jogador.nome + " (" + jogador.posicao + ") — carga: " +
            jogador.cargaTotal.toFixed(2) + " | treinos: " + jogador.qtdTreinos +
            risco + "</p>";
    });

    let mediaFisico = qtdPorTipo["Físico"] > 0 ? somaPorTipo["Físico"] / qtdPorTipo["Físico"] : 0;
    let mediaTecnico = qtdPorTipo["Técnico"] > 0 ? somaPorTipo["Técnico"] / qtdPorTipo["Técnico"] : 0;
    let mediaEstrategico = qtdPorTipo["Estratégico"] > 0 ? somaPorTipo["Estratégico"] / qtdPorTipo["Estratégico"] : 0;

    // médias por posição
    let mediaGoleiro = qtdPorPosicao["Goleiro"] > 0 ? somaCargaPorPosicao["Goleiro"] / qtdPorPosicao["Goleiro"] : 0;
    let mediaZagueiro = qtdPorPosicao["Zagueiro"] > 0 ? somaCargaPorPosicao["Zagueiro"] / qtdPorPosicao["Zagueiro"] : 0;
    let mediaMeio = qtdPorPosicao["Meio-campo"] > 0 ? somaCargaPorPosicao["Meio-campo"] / qtdPorPosicao["Meio-campo"] : 0;
    let mediaAtacante = qtdPorPosicao["Atacante"] > 0 ? somaCargaPorPosicao["Atacante"] / qtdPorPosicao["Atacante"] : 0;

    let textoMaiorCarga = maiorCarga.nome + " (" + maiorCarga.posicao + ", " + maiorCarga.qtdTreinos + " treinos)";
    let textoMenorCarga = menorCarga.nome + " (" + menorCarga.posicao + ", " + menorCarga.qtdTreinos + " treinos)";

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de treinos cadastrados: " + totalTreinos + "</p>" +
        "<h4>Carga por jogador</h4>" +
        textoJogadores +
        "<p>Jogador com maior carga: " + textoMaiorCarga + "</p>" +
        "<p>Jogador com menor carga: " + textoMenorCarga + "</p>" +
        "<p>Jogadores com risco de lesão: " + qtdRisco + "</p>" +
        "<h4>Carga média por tipo de treino</h4>" +
        "<p>Físico: " + mediaFisico.toFixed(2) + "</p>" +
        "<p>Técnico: " + mediaTecnico.toFixed(2) + "</p>" +
        "<p>Estratégico: " + mediaEstrategico.toFixed(2) + "</p>" +
        "<h4>Por posição</h4>" +
        "<p>Goleiro — treinos: " + qtdPorPosicao["Goleiro"] + " | carga média: " + mediaGoleiro.toFixed(2) + "</p>" +
        "<p>Zagueiro — treinos: " + qtdPorPosicao["Zagueiro"] + " | carga média: " + mediaZagueiro.toFixed(2) + "</p>" +
        "<p>Meio-campo — treinos: " + qtdPorPosicao["Meio-campo"] + " | carga média: " + mediaMeio.toFixed(2) + "</p>" +
        "<p>Atacante — treinos: " + qtdPorPosicao["Atacante"] + " | carga média: " + mediaAtacante.toFixed(2) + "</p>";

});