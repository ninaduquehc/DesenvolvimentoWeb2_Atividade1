// Footer
function criarHeader() {
    const header = document.createElement("header");

    header.innerHTML = `
        <nav class="navbar">
            <div class="navbar-container">

                <a href="index.html" class="logo">
                    Atividade Avaliativa
                </a>

                <button class="menu-toggle" id="menu-toggle">
                    ☰
                </button>

                <ul class="nav-links" id="nav-links">
                    <li>
                        <a href="index.html">Início</a>
                    </li>

                    <li>
                        <a href="exercicio1.html">Exercício 1</a>
                    </li>

                    <li>
                        <a href="exercicio2.html">Exercício 2</a>
                    </li>

                    <li>
                        <a href="exercicio3.html">Exercício 3</a>
                    </li>

                    <li>
                        <a href="exercicio4.html">Exercício 4</a>
                    </li>

                    <li>
                        <a href="exercicio5.html">Exercício 5</a>
                    </li>

                    <li>
                        <a href="exercicio6.html">Exercício 6</a>
                    </li>
                </ul>

            </div>
        </nav>
    `;

    document.body.prepend(header);
}


// Footer
function criarFooter() {
    const footer = document.createElement("footer");

    footer.innerHTML = `
        <div class="footer-container">
            <p>
                Atividade Avaliativa Individual 01
            </p>

            <p>
                HTML • CSS • JavaScript
            </p>
        </div>
    `;

    document.body.appendChild(footer);
}


// ===============================
// MENU MOBILE
// ===============================

function configurarMenu() {

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}


// ===============================
// DESTACAR PÁGINA ATUAL
// ===============================

function destacarPaginaAtual() {

    const paginaAtual = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".nav-links a");

    links.forEach(function (link) {

        const paginaLink = link.getAttribute("href");

        if (paginaLink === paginaAtual) {
            link.classList.add("active");
        }

    });
}


// ===============================
// INICIALIZAÇÃO DO LAYOUT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    criarHeader();
    criarFooter();

    configurarMenu();
    destacarPaginaAtual();

});