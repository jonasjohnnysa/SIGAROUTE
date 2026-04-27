const Rota = require('../models/Rota');

class RotaRepository {
  constructor() {
    this.rotas = [];
  }

  create(nome, descricao) {
    const rota = new Rota(nome, descricao);
    this.rotas.push(rota);
    return rota;
  }

  findAll() {
    return [...this.rotas];
  }

  findById(id) {
    return this.rotas.find(rota => rota.id === id) || null;
  }

  findByStatus(status) {
    return this.rotas.filter(rota => rota.status === status);
  }

  update(id, dados) {
    const rota = this.findById(id);
    if (rota) {
      rota.atualizar(dados);
      return rota;
    }
    return null;
  }

  delete(id) {
    const index = this.rotas.findIndex(rota => rota.id === id);
    if (index !== -1) {
      const rota = this.rotas.splice(index, 1);
      return rota[0];
    }
    return null;
  }

  disable(id) {
    const rota = this.findById(id);
    if (rota) {
      rota.desativar();
      return rota;
    }
    return null;
  }

  adicionarEndereco(rotaId, enderecoId) {
    const rota = this.findById(rotaId);
    if (rota) {
      rota.adicionarEndereco(enderecoId);
      return rota;
    }
    return null;
  }

  removerEndereco(rotaId, enderecoId) {
    const rota = this.findById(rotaId);
    if (rota) {
      rota.removerEndereco(enderecoId);
      return rota;
    }
    return null;
  }

  adicionarDestinatario(rotaId, destinatarioId) {
    const rota = this.findById(rotaId);
    if (rota) {
      rota.adicionarDestinatario(destinatarioId);
      return rota;
    }
    return null;
  }

  removerDestinatario(rotaId, destinatarioId) {
    const rota = this.findById(rotaId);
    if (rota) {
      rota.removerDestinatario(destinatarioId);
      return rota;
    }
    return null;
  }

  count() {
    return this.rotas.length;
  }
}

module.exports = new RotaRepository();
