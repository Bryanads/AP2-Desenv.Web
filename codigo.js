const manipulaBotaoLogin = () => {
    const senha = document.getElementById("senha_input_field").value;
    const senhaCriptografada = hex_sha256(senha);


    if (senhaCriptografada === "ce855f48b7422de36b50512a9a0a06a59d4f2f6efac6f439456777a396773cc1") {
        sessionStorage.setItem('login', true);
        mostrarTelaPrincipal();
    } else {
        alert("Senha incorreta");
    }
};


const mostrarTelaPrincipal = () => {
    document.getElementById("login_card").style.display = "none";
    document.getElementById("header").style.display = "flex";
    document.getElementById("container").style.display = "grid";

    verificarTimeSelecionado();
    botoesTimes();
    adicionarPesquisa();
};


const checkLoginStatus = () => {
    if (sessionStorage.getItem('login')) {
        mostrarTelaPrincipal();
    } else {
        document.getElementById("login_card").style.display = "flex";
        document.getElementById("header").style.display = "none";
        document.getElementById("container").style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login_btn").onclick = manipulaBotaoLogin;

    document.getElementById("logout_btn").onclick = () => {
        sessionStorage.removeItem('login');
        checkLoginStatus();
    };
});

// Funções principais para carregar atletas e montar os cards
const url = "https://botafogo-atletas.mange.li/2024-1/";

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const link = document.createElement("a");

    nome.innerHTML = atleta.nome;
    nome.style.fontFamily = "sans-serif";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    link.innerHTML = "Ver mais";
    link.href = `detalhes.html?id=${atleta.id}`;
    cartao.appendChild(link);

    return cartao;
};

const carregaAtletas = (time, pesquisa = '') => {
    document.getElementById("container").innerHTML = "";
    sessionStorage.setItem('timeSelecionado', time);
    pega_json(`${url}${time}`).then((resposta) => {
        const atletasFiltrados = resposta.filter(atleta => atleta.nome.toLowerCase().includes(pesquisa.toLowerCase()));
        atletasFiltrados.forEach((atleta) => document.getElementById("container").appendChild(montaCard(atleta)));
    });
};

const verificarTimeSelecionado = () => {
    const timeSelecionado = sessionStorage.getItem('timeSelecionado');
    if (timeSelecionado) {
        carregaAtletas(timeSelecionado);
    }
};

const botoesTimes = () => {
    const botoesContainer = document.getElementById("escolher_elenco");
    botoesContainer.innerHTML = window.innerWidth > 768
        ? `<div class="botao_selecao">
             <button class="team_button" data-time="masculino">Time Masculino</button>
             <button class="team_button" data-time="feminino">Time Feminino</button>
             <button class="team_button" data-time="all">Todos os Atletas</button>
           </div>`
        : `<div class="botao_selecao">
             <select id="team_dropdown">
                <option>ESCOLHA</option>
                <option value="masculino">Time Masculino</option>
                <option value="feminino">Time Feminino</option>
                <option value="all">Todos os Atletas</option>
             </select>
           </div>`;

    if (window.innerWidth > 768) {
        document.querySelectorAll(".team_button").forEach(button => {
            button.addEventListener("click", (e) => {
                const timeSelecionado = e.target.getAttribute("data-time");
                carregaAtletas(timeSelecionado);
            });
        });
    } else {
        document.getElementById("team_dropdown").addEventListener("change", (e) => {
            const timeSelecionado = e.target.value;
            carregaAtletas(timeSelecionado);
        });
    }
};

const adicionarPesquisa = () => {
    const pesquisaContainer = document.getElementById("pesquisa-container");
    document.getElementById("pesquisa-container").style.display = "flex";

    const inputPesquisa = document.getElementById("input_pesquisa");

    inputPesquisa.addEventListener("input", (e) => {
        const pesquisa = e.target.value;
        const timeSelecionado = sessionStorage.getItem('timeSelecionado');
        if (timeSelecionado) {
            carregaAtletas(timeSelecionado, pesquisa);
        }
    });
};

window.addEventListener('resize', botoesTimes);


window.onload = checkLoginStatus;
