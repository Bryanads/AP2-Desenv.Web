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
    let botoesContainer = document.getElementById("escolher_elenco");

    if (!botoesContainer) {
        botoesContainer = document.createElement("div");
        botoesContainer.id = "botoes";
        document.body.appendChild(botoesContainer);
    }

    if (window.innerWidth > 768) {
        botoesContainer.innerHTML = `
            <div class="botao_selecao">
                <div id="team_selection">
                    <button class="team_button" data-time="masculino">Time Masculino</button>
                    <button class="team_button" data-time="feminino">Time Feminino</button>
                    <button class="team_button" data-time="all">Todos os Atletas</button>
                </div>
            </div>
        `;
    } else {
        botoesContainer.innerHTML = `
            <div class="botao_selecao">
                <select id="team_dropdown">
                    <option>ESCOLHA</option>
                    <option value="masculino">Time Masculino</option>
                    <option value="feminino">Time Feminino</option>
                    <option value="all">Todos os Atletas</option>
                </select>
            </div>
        `;
    }

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
    const pesquisaContainer = document.createElement("div");
    pesquisaContainer.id = "pesquisa-container";

    const inputPesquisa = document.createElement("input");
    inputPesquisa.type = "text";
    inputPesquisa.placeholder = "Pesquisar atleta...";
    pesquisaContainer.appendChild(inputPesquisa);
    document.body.insertBefore(pesquisaContainer, document.getElementById("container"));

    inputPesquisa.addEventListener("input", (e) => {
        const pesquisa = e.target.value;
        const timeSelecionado = sessionStorage.getItem('timeSelecionado');
        if (timeSelecionado) {
            carregaAtletas(timeSelecionado, pesquisa);
            console.log(pesquisa);
        }
    });
};

const checkLoginStatus = () => {
    if (!sessionStorage.getItem('login')) {
        window.location.href = "login.html";
    } else {
        document.getElementById("header").style.display = "flex";
        document.getElementById("logout_btn").style.display = "flex";
    }
};

document.getElementById("logout_btn").onclick = () => {
    document.getElementById("container").innerHTML = "";
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('timeSelecionado');  // Limpar a seleção do time
    document.getElementById("header").style.display = "none";
    document.getElementById("logout_btn").style.display = "none";
    checkLoginStatus();
};

window.onload = () => {
    checkLoginStatus();
    verificarTimeSelecionado();
    botoesTimes();
    adicionarPesquisa();
};

window.addEventListener("resize", botoesTimes);
