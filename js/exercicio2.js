let campoSalarioMinimo = document.getElementById("salarioMinimo");
let campoCodigo = document.getElementById("codigoFuncionario");
let campoHoras = document.getElementById("horasTrabalhadas");
let campoCategoria = document.getElementById("categoria");
let campoTurno = document.getElementById("turno");
let campoDesempenho = document.getElementById("desempenho");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");

let campoRelatorio = document.getElementById("relatorio");
let botaoRelatorio = document.getElementById("gerarRelatorio");

let funcionarios = [];

botao.addEventListener("click", function () {

    let salarioMinimo = Number(campoSalarioMinimo.value);
    let codigo = campoCodigo.value.trim();
    let horas = Number(campoHoras.value);
    let categoria = campoCategoria.value.trim().toUpperCase();
    let turno = campoTurno.value.trim().toUpperCase();
    let desempenho = Number(campoDesempenho.value);

    let codigoJaExiste = funcionarios.some(function (funcionario) {
        return funcionario.codigo === codigo;
    });

    if (codigo === "" || codigoJaExiste) {
        alert("Código inválido ou já utilizado.");
        return;
    }


    while (desempenho < 0 || desempenho > 10 || isNaN(desempenho)) {
        desempenho = Number(prompt("Nota inválida. Digite um valor entre 0 e 10:"));
    }

    let percentualHora;
    let categoriaValida = false;

    while (!categoriaValida) {

        switch (categoria) {
            case "F":
                switch (turno) {
                    case "M": percentualHora = 0.10; categoriaValida = true; break;
                    case "V": percentualHora = 0.15; categoriaValida = true; break;
                    case "N": percentualHora = 0.20; categoriaValida = true; break;
                    default:
                        turno = prompt("Turno inválido. Digite M, V ou N:").toUpperCase();
                }
                break;

            case "G":
                switch (turno) {
                    case "M": percentualHora = 0.30; categoriaValida = true; break;
                    case "V": percentualHora = 0.35; categoriaValida = true; break;
                    case "N": percentualHora = 0.40; categoriaValida = true; break;
                    default:
                        turno = prompt("Turno inválido. Digite M, V ou N:").toUpperCase();
                }
                break;

            default:
                categoria = prompt("Categoria inválida. Digite F ou G:").toUpperCase();
        }

    }

    let salarioInicial = horas * (percentualHora * salarioMinimo);

    let percentualAlimentacao;
    if (salarioInicial <= 800) {
        percentualAlimentacao = 0.25;
    } else if (salarioInicial <= 1200) {
        percentualAlimentacao = 0.20;
    } else {
        percentualAlimentacao = 0.15;
    }
    let auxilioAlimentacao = salarioInicial * percentualAlimentacao;

    let percentualBonus;
    if (desempenho >= 9) {
        percentualBonus = 0.10;
    } else if (desempenho >= 7) {
        percentualBonus = 0.05;
    } else if (desempenho >= 5) {
        percentualBonus = 0.02;
    } else {
        percentualBonus = 0;
    }
    let bonus = salarioInicial * percentualBonus;

    let salarioFinal = salarioInicial + auxilioAlimentacao + bonus;

    resultado.textContent =
        "Salário final: R$ " + salarioFinal.toFixed(2);

    funcionarios.push({
        codigo,
        categoria,
        turno,
        desempenho,
        salarioFinal,
        percentualBonus
    });

    console.log("Funcionários até agora:", funcionarios);

});

botaoRelatorio.addEventListener("click", function () {

    if (funcionarios.length === 0) {
        campoRelatorio.textContent = "Nenhum funcionário cadastrado ainda.";
        return;
    }

    let totalFuncionarios = funcionarios.length;
    let somaSalarioGeral = 0;
    let somaSalarioF = 0;
    let contagemF = 0;
    let somaSalarioG = 0;
    let contagemG = 0;
    let maiorSalario = funcionarios[0];
    let menorSalario = funcionarios[0];
    let qtdBonus10 = 0;
    let qtdBonus5 = 0;
    let qtdBonus2 = 0;
    let qtdBonus0 = 0;

    funcionarios.forEach(function (funcionario) {
        somaSalarioGeral += funcionario.salarioFinal;
        if (funcionario.categoria === "F") {
            somaSalarioF += funcionario.salarioFinal;
            contagemF++;
        } else if (funcionario.categoria === "G") {
            somaSalarioG += funcionario.salarioFinal;
            contagemG++;
        }

        if (funcionario.salarioFinal > maiorSalario.salarioFinal) {
            maiorSalario = funcionario;
        }
        if (funcionario.salarioFinal < menorSalario.salarioFinal) {
            menorSalario = funcionario;
        }

        if (funcionario.percentualBonus === 0.10) {
            qtdBonus10++;
        } else if (funcionario.percentualBonus === 0.05) {
            qtdBonus5++;
        } else if (funcionario.percentualBonus === 0.02) {
            qtdBonus2++;
        } else {
            qtdBonus0++;
        }

    });

    let mediaGeral = somaSalarioGeral / totalFuncionarios;

    let mediaF = contagemF > 0 ? somaSalarioF / contagemF : 0;
    let mediaG = contagemG > 0 ? somaSalarioG / contagemG : 0;

    let textoMaiorSalario = maiorSalario.codigo + " (" + maiorSalario.categoria + "/" + maiorSalario.turno + ") - R$ " + maiorSalario.salarioFinal.toFixed(2);
    let textoMenorSalario = menorSalario.codigo + " (" + menorSalario.categoria + "/" + menorSalario.turno + ") - R$ " + menorSalario.salarioFinal.toFixed(2);

    campoRelatorio.innerHTML =
        "<h3>Relatório Final</h3>" +
        "<p>Total de funcionários: " + totalFuncionarios + "</p>" +
        "<p>Média salarial geral: R$ " + mediaGeral.toFixed(2) + "</p>" +
        "<p>Média salarial - Operacional (F): R$ " + mediaF.toFixed(2) + "</p>" +
        "<p>Média salarial - Gerente (G): R$ " + mediaG.toFixed(2) + "</p>" +
        "<p>Maior salário: " + textoMaiorSalario + "</p>" +
        "<p>Menor salário: " + textoMenorSalario + "</p>" +
        "<p>Funcionários com bônus de 10%: " + qtdBonus10 + "</p>" +
        "<p>Funcionários com bônus de 5%: " + qtdBonus5 + "</p>" +
        "<p>Funcionários com bônus de 2%: " + qtdBonus2 + "</p>" +
        "<p>Funcionários sem bônus: " + qtdBonus0 + "</p>";

});