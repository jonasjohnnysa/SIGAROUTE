class Destinatario {
  constructor(nome, email, telefone, endereco) {
    this.id = this.generateId();
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.endereco = endereco;
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

module.exports = Destinatario;
