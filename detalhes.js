const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const url = "https://botafogo-atletas.mange.li/2024-1/";

const pega_json = async (caminho) => {
    const resposta = await fetch (caminho);
    const dados = await resposta.json();
    return dados;
}

const container = document.getElementById("container");

const montaCard = (atleta) => {
    // Limpar conteúdo anterior
    document.getElementById("container").innerHTML = "";

    // Criando o header
    const header = document.createElement("header");
    const nome = document.createElement("h1");

    // Criando o layout principal
    const main = document.createElement("div");
    const informacoes = document.createElement("div");
    const descri = document.createElement("p");
    const infos = document.createElement("div");
    const imagem = document.createElement("img");

    // Adicionando classes para estilização
    header.classList.add("header");
    main.classList.add("main");
    informacoes.classList.add("informacoes");
    descri.classList.add("descricao");
    infos.classList.add("infos");

    // Adicionando conteúdo
    nome.innerHTML = atleta.nome;
    imagem.src = atleta.imagem;
    descri.innerHTML = atleta.detalhes;

    // Criando elementos de informações
    const altura = document.createElement("p");
    const elenco = document.createElement("p");
    const jogos = document.createElement("p");
    const posicao = document.createElement("p");
    const naturalidade = document.createElement("p");
    const nascimento = document.createElement("p");

    altura.innerHTML = `Altura: ${atleta.altura}`;
    elenco.innerHTML = `Elenco: ${atleta.elenco}`;
    jogos.innerHTML = `Jogos: ${atleta.n_jogos}`;
    posicao.innerHTML = `Posição: ${atleta.posicao}`;
    naturalidade.innerHTML = `Naturalidade: ${atleta.naturalidade}`;
    nascimento.innerHTML = `Nascimento: ${atleta.nascimento}`;

    // Adicionando informações na div infos
    infos.appendChild(altura);
    infos.appendChild(elenco);
    infos.appendChild(jogos);
    infos.appendChild(posicao);
    infos.appendChild(naturalidade);
    infos.appendChild(nascimento);

    // Montando a estrutura
    informacoes.appendChild(descri);
    informacoes.appendChild(infos);

    header.appendChild(nome);
    main.appendChild(informacoes);
    main.appendChild(imagem);

    // Adicionando ao container
    const container = document.getElementById("container");
    container.appendChild(header);
    container.appendChild(main);
};



function montaCardComVerificacao(id) {
    console.log("entrou");

    const isLoggedIn = sessionStorage.getItem("login") === "true";

    if (id < 1 || id > 60) {
        container.innerHTML = "ID não é válido";
        return;
    }

    if (!isLoggedIn) {
        container.innerHTML = "Você não está logado";
        return;
    }

    pega_json(`${url}${id}`).then((r) => {
        if (r) {
            container.appendChild(montaCard(r));
        }
    });
}

montaCardComVerificacao(id);
