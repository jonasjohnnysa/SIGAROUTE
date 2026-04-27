const Destinatario = require('../models/Destinatario');

class DestinatarioRepository {
  constructor() {
    this.destinatarios = [];
  }

  create(nome, email, telefone, endereco) {
    const destinatario = new Destinatario(nome, email, telefone, endereco);
    this.destinatarios.push(destinatario);
    return destinatario;
  }

  findAll() {
    return [...this.destinatarios];
  }

  findById(id) {
    return this.destinatarios.find(destinatario => destinatario.id === id) || null;
  }

  findByEmail(email) {
    return this.destinatarios.find(destinatario => destinatario.email === email) || null;
  }

  findByNome(nome) {
    return this.destinatarios.filter(destinatario =>
      destinatario.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  update(id, dados) {
    const destinatario = this.findById(id);
    if (destinatario) {
      destinatario.atualizar(dados);
      return destinatario;
    }
    return null;
  }

  delete(id) {
    const index = this.destinatarios.findIndex(destinatario => destinatario.id === id);
    if (index !== -1) {
      const destinatario = this.destinatarios.splice(index, 1);
      return destinatario[0];
    }
    return null;
  }

  disable(id) {
    const destinatario = this.findById(id);
    if (destinatario) {
      destinatario.desativar();
      return destinatario;
    }
    return null;
  }

  count() {
    return this.destinatarios.length;
  }
}

module.exports = new DestinatarioRepository();
