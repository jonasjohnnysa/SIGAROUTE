class Endereco {
  constructor(rua, numero, bairro, cidade, estado, cep) {
    this.id = this.generateId();
    this.rua = rua;
    this.numero = numero;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.ativo = true;
    this.dataCriacao = new Date();
    this.dataAtualizacao = new Date();
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  atualizar(dados) {
    Object.assign(this, dados);
    this.dataAtualizacao = new Date();
  }

  desativar() {
    this.ativo = false;
    this.dataAtualizacao = new Date();
  }
}

module.exports = Endereco;
