let campoSalarioMinimo = document.getElementById("salarioMinimo");
let campoCodigo = document.getElementById("codigoFuncionario");
let campoHoras = document.getElementById("horasTrabalhadas");
let campoCategoria = document.getElementById("categoria");
let campoTurno = document.getElementById("turno");
let campoDesempenho = document.getElementById("desempenho");
let botao = document.getElementById("calcular");
let resultado = document.getElementById("resultado");
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
        codigo: codigo,
        categoria: categoria,
        turno: turno,
        desempenho: desempenho,
        salarioFinal: salarioFinal,
        percentualBonus: percentualBonus
    });

    console.log("Funcionários até agora:", funcionarios);

});