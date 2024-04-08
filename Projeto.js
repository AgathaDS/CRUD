const express = require("express");
const app = express();
const PORT = 4000;
app.use(express.json());

// 3-Aplicando Middlewares

// Middlewares nas rotas para logar as informações de cada chamada realizada

const loggerMiddleware = (req, res, next) => {
    const date = new Date().toISOString();
    console.log(`[${date}] ${req.method} ${req.url}`);
    next();
};

// Aplicando o middleware de logging a todas as rotas
app.use(loggerMiddleware);

// 1-Funcionalidades do CRUD:

// Lista temporária de produtos
let Produtos = [];
let id = 1; 


// Estrutura JSON do produto
class Produto {
    constructor(nome, preço, descrição, id){
        this.nome = nome;
        this.preço = preço;
        this.descrição = descrição;
        this.id = id;
    }
}

// ● Criar Produto:

// Rota POST para adicionar um novo produto
app.post("/produto", (req, res) => {
    const { nome, preco, descrição } = req.body;
    const newProduto = new Produto(nome, preco, descrição, id++);
    Produtos.push(newProduto);
    res.status(201).json(newProduto);
});

// ● Listar Produtos:

// Rota GET para obter todos os produtos e retornar a lista de produtos em formato JSON
app.get("/produtos", (req, res) => {
    res.status(200).json(Produtos);
});

//validar os dados recebidos
app.get("/produto/:id", (req, res) => {
    const produtoid = parseInt(req.params.id);
    const Produto = Produtos.find(P => P.id === produtoid);
    if (Produto) {
        res.status(200).json(Produto);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
}); 

// ● Atualizar Produto:
// Rota PUT para atualizar um produto existente
app.put("/produto/:id", (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;    

    const produtoid = parseInt(req.params.id);
    const index = Produtos.findIndex(P => P.id === produtoid);
    
    if (index !== -1) {
        // Atualizar os dados do produto
        Produtos[index].nome = nome;
        Produtos[index].preco = preco; 
        Produtos[index].descricao = descricao;

        res.status(200).json({ mensagem: "Produto atualizado com sucesso!", produto: Produtos[index] });
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});



// ● Excluir Produto:
app.delete("/produto/:id", (req, res) => {
    const produtoid = parseInt(req.params.id);
    const index = Produtos.findIndex(p => p.id === produtoid);
    if (index !== -1) {
        const deletedProduto = Produtos.splice(index, 1);
        res.status(200).json({ message: 'Produto deletado', deletedProduto: deletedProduto[0] });
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// 2-Testando com o Postman
// Monte uma coleção no Postman para realizar as operações CRUD.

// As rotas devem enviar requisições para as rotas criadas, 
//usando os métodos HTTP corretos (POST, GET, PUT, DELETE).

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 