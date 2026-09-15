//
// FASE 1: modelagem dos dados (Classe Base)
//
// A classe funciona como um molde para criar produtos
class Produto {
    constructor(nome, preco, quantidade) {

        // validação do nome
        if (nome.trim() === "") {
            throw new Error("O nome do produto não pode estar em branco.");
        }

        // transforma os valores
        preco = parseFloat(preco);
        quantidade = parseInt(quantidade);

        // validação do preço
        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }

        // validação da quantidade
        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero.");
        }

        // propriedades do objeto recebidas no momento da criação
        this.nome = nome;
        this.#preco = preco;
        this.#quantidade = quantidade;
    }

    // atributos privados
    #preco;
    #quantidade;

    // getter do preço
    get preco() {
        return this.#preco;
    }

    // getter da quantidade
    get quantidade() {
        return this.#quantidade;
    }

    // método que calcula o subtotal
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

//
// FASE 2: Gerenciamento de Estado (memória)
//
// Array global que guardará todas as instâncias da classe Produto

const listaDeProdutos = [];

//
// FASE 3: Escuta de Eventos do DOM
//
// Selecionamos o formulário pelo ID
const formProduto = document.getElementById("produto-form");

// adicionar um escutador de eventos para quando o formulário for enviado
formProduto.addEventListener("submit", function (event) {
    event.preventDefault();

    // 1. captura dos valores digitados nos campos de input
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    try {

        // 2. Criar uma nova instância da classe Produto
        const novoProduto = new Produto(
            nomeInput,
            precoInput,
            quantidadeInput
        );

        // 3. Adiciona o novo produto ao array
        listaDeProdutos.push(novoProduto);

        // 4. atualiza a exibição da tabela
        renderizarTabela();

        // 5. limpa o formulário
        formProduto.reset();

    } catch (erro) {

        // exibe o erro em um alert sem travar a aplicação
        alert(erro.message);
    }
});

//
// FASE 4: Renderização da Interface DOM
//
// função responsável por desenhar na tela o estado
// atual do array listaDeProdutos
function renderizarTabela() {

    // seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");

    // limpa o conteúdo anterior da tabela
    tabelaBody.innerHTML = "";

    // percorre o array de produtos usando forEach
    listaDeProdutos.forEach((produto, index) => {

        // criar uma linha tr dentro da tabela
        const linha = document.createElement("tr");

        // preenche o conteúdo da linha com os dados do objeto
        linha.innerHTML = `
    <td>${produto.nome}</td>
    <td>R$ ${produto.preco.toFixed(2)}</td>
    <td>${produto.quantidade}</td>
    <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
    <td>
    <button class="btn-remover" onclick="removerProduto(${index})">
    Remover
    </button>
    </td>
    `;

        // insere a linha criada dentro do tbody
        tabelaBody.appendChild(linha);
    });

    // atualiza o total do estoque
    atualizarTotalEstoque();
}

//
// FASE 5: Indicadores Financeiros do Estoque
//
// função responsável por calcular o valor total
// de todos os produtos cadastrados
function atualizarTotalEstoque() {

    // usa o método reduce para somar os subtotais
    const total = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.calcularSubtotal();
    }, 0);

    // seleciona o elemento HTML
    const totalEstoque = document.getElementById("total-estoque");

    // atualiza o texto formatado em moeda brasileira
    totalEstoque.textContent = `Total em Estoque: ${total.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    )}`;
}

//
// FASE 6: Remoção de Produtos
//
// função responsável por remover um produto
// recebendo a posição do item no array
function removerProduto(index) {

    // remove um item do array usando splice
    listaDeProdutos.splice(index, 1);

    // atualiza a tabela
    renderizarTabela();
}

//
// FASE 7: Limpeza Total do Estoque
//
// seleciona o botão de limpar a tabela
const botaoLimpar = document.getElementById("limpar-tabela");

// adiciona um evento de clique no botão
botaoLimpar.addEventListener("click", function () {

    // esvazia completamente o array
    listaDeProdutos.length = 0;

    // atualiza a tabela e o total
    renderizarTabela();
});
