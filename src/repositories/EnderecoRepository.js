const Endereco = require('../models/Endereco');

class EnderecoRepository {
  constructor() {
    this.enderecos = [];
  }

  create(rua, numero, bairro, cidade, estado, cep) {
    const endereco = new Endereco(rua, numero, bairro, cidade, estado, cep);
    this.enderecos.push(endereco);
    return endereco;
  }

  findAll() {
    return [...this.enderecos];
  }

  findById(id) {
    return this.enderecos.find(endereco => endereco.id === id) || null;
  }

  findByCity(cidade) {
    return this.enderecos.filter(endereco => endereco.cidade === cidade);
  }

  update(id, dados) {
    const endereco = this.findById(id);
    if (endereco) {
      endereco.atualizar(dados);
      return endereco;
    }
    return null;
  }

  delete(id) {
    const index = this.enderecos.findIndex(endereco => endereco.id === id);
    if (index !== -1) {
      const endereco = this.enderecos.splice(index, 1);
      return endereco[0];
    }
    return null;
  }

  disable(id) {
    const endereco = this.findById(id);
    if (endereco) {
      endereco.desativar();
      return endereco;
    }
    return null;
  }

  count() {
    return this.enderecos.length;
  }
}

module.exports = new EnderecoRepository();
