//
//FASE 1: modelagem dos dados (Classe Base)
//
//A classe funciona como um molde para criar produtos
class Produto {
    // Desafio 1: Declaração dos atributos privados
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        // Desafio 1: Validações antes de atribuir os valores
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do produto não pode estar em branco!");
        }
        if (parseFloat(preco) <= 0 || isNaN(preco)) {
            throw new Error("O preço do produto deve ser maior que zero!");
        }
        if (parseInt(quantidade) <= 0 || isNaN(quantidade)) {
            throw new Error("A quantidade do produto deve ser maior que zero!");
        }

        //propriedades do objeto recebidas no momento da criação
        this.nome = nome;
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    // Desafio 1: Getters para leitura dos atributos privados
    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    //método que calcula o subtotal
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

//
//FASE 2: Gerenciamento de Estado (memória)
//
//Array global que guardará todas as instâncias da classe Produto

const listaDeProdutos = [];

//
//FASE 3: Escuta de Eventos do DOM
//
//Selecionamos o formulário pelo ID
const formProduto = document.getElementById("produto-form");

//adicionar um escutador de eventos para quando o formulário for enviado
formProduto.addEventListener("submit", function (event) {
    event.preventDefault();

    //1.captura dos valores digitados nos campos de input
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    // Desafio 1: Uso do bloco try / catch para envelopar a criação do objeto
    try {
        //2. Criar uma nova instância da classe Produto
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);

        //3.Adiciona o novo produto ao array
        listaDeProdutos.push(novoProduto);

        //4. atualiza a exibição da tabela e limpa o formulário
        renderizarTabela();
        formProduto.reset();
    } catch (error) {
        // Exibe o erro customizado em um alert sem quebrar a execução do sistema
        alert(error.message);
    }
});

//
//FASE 4: Renderização da Interface DOM
//
//função responsável por desenhar na tela o estado
//atual do array listDeProdutos
function renderizarTabela() {
    //seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");

    //limpa o conteúdo anterior da tabela
    tabelaBody.innerHTML = "";

    //percorre o array de produtos usando forEach
    // Desafio 3: Adicionado o parâmetro 'index' no forEach para mapear a posição
    listaDeProdutos.forEach((produto, index) => {
        //criar uam linha tr dentro da tabela
        const linha = document.createElement("tr");

        //preenche o conteúdo da linha com os dados do objeto
        // Desafio 3: Vinculada a função removerProduto(index) no onclick do botão
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        //insere a linha criada dentro do tbody da tabela
        tabelaBody.appendChild(linha);
    });

    // Desafio 2: Atualiza o indicador financeiro global sempre que renderizar a tabela
    atualizarTotalEstoque();
}

// Desafio 2: Função que calcula o acumulado usando .reduce() e atualiza a interface
function atualizarTotalEstoque() {
    const totalGeral = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.calcularSubtotal();
    }, 0);

    const elementoTotal = document.getElementById("total-estoque");

    // Formata o valor final em moeda brasileira (R$ XX,XX)
    elementoTotal.innerText = `Total em Estoque: ${totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

// Desafio 3: Função para remoção individual de um produto
function removerProduto(index) {
    listaDeProdutos.splice(index, 1); // Remove o elemento do array pela sua posição
    renderizarTabela(); // Atualiza os dados na tela
}

// Desafio 3: Evento de clique para o botão "Limpar Tudo"
const btnLimparTabela = document.getElementById("limpar-tabela");
btnLimparTabela.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja limpar todo o estoque?")) {
        listaDeProdutos.length = 0; // Esvazia o array mantendo a mesma referência
        renderizarTabela(); // Atualiza a tela limpando as linhas e zerando o total
    }
});
