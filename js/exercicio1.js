let campoPreco = document.getElementById("precoCombustivel");

let campoDistancia = document.getElementById("distancia");

let campoQuantidade = document.getElementById("quantidadePecas");

let botao = document.getElementById("calcular");

let resultado = document.getElementById("resultado");


botao.addEventListener("click", function () {

    let preco = Number(campoPreco.value);

    let distancia = Number(campoDistancia.value);

    let quantidade = Number(campoQuantidade.value);

    if (quantidade > 1000) {

        let excedente = quantidade - 1000;

        console.log("Excedente:", excedente);

    } else {

        console.log("Não há excedente.");

    }

    let custo = preco * distancia;

    resultado.textContent = "Custo do combustível: R$ " + custo.toFixed(2);

});