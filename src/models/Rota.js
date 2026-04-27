class Rota {
  constructor(nome, descricao) {
    this.id = this.generateId();
    this.nome = nome;
    this.descricao = descricao;
    this.enderecosIds = [];
    this.destinatariosIds = [];
    this.status = 'ativa';
    this.dataCriacao = new Date();
    this.dataAtualizacao = new Date();
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  adicionarEndereco(enderecoId) {
    if (!this.enderecosIds.includes(enderecoId)) {
      this.enderecosIds.push(enderecoId);
      this.dataAtualizacao = new Date();
    }
  }

  removerEndereco(enderecoId) {
    this.enderecosIds = this.enderecosIds.filter(id => id !== enderecoId);
    this.dataAtualizacao = new Date();
  }

  adicionarDestinatario(destinatarioId) {
    if (!this.destinatariosIds.includes(destinatarioId)) {
      this.destinatariosIds.push(destinatarioId);
      this.dataAtualizacao = new Date();
    }
  }

  removerDestinatario(destinatarioId) {
    this.destinatariosIds = this.destinatariosIds.filter(id => id !== destinatarioId);
    this.dataAtualizacao = new Date();
  }

  atualizar(dados) {
    if (dados.nome) this.nome = dados.nome;
    if (dados.descricao) this.descricao = dados.descricao;
    if (dados.status) this.status = dados.status;
    this.dataAtualizacao = new Date();
  }

  desativar() {
    this.status = 'inativa';
    this.dataAtualizacao = new Date();
  }
}

module.exports = Rota;
