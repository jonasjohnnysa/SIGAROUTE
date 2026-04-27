const rotaRepository = require('../repositories/RotaRepository');
const enderecoRepository = require('../repositories/EnderecoRepository');
const destinatarioRepository = require('../repositories/DestinatarioRepository');

class RotaService {
  validarCamposObrigatorios(nome, descricao) {
    if (!nome || !descricao) {
      throw new Error('Nome e descrição são obrigatórios');
    }
  }

  validarStatusValido(status) {
    const statusValidos = ['ativa', 'inativa', 'pausada'];
    if (status && !statusValidos.includes(status)) {
      throw new Error(`Status inválido. Valores aceitos: ${statusValidos.join(', ')}`);
    }
  }

  validarEnderecosExistem(enderecosIds) {
    const enderecosIds_array = Array.isArray(enderecosIds) ? enderecosIds : [enderecosIds];
    for (const id of enderecosIds_array) {
      if (!enderecoRepository.findById(id)) {
        throw new Error(`Endereço com ID ${id} não encontrado`);
      }
    }
  }

  validarDestinatariosExistem(destinatariosIds) {
    const destinatariosIds_array = Array.isArray(destinatariosIds) ? destinatariosIds : [destinatariosIds];
    for (const id of destinatariosIds_array) {
      if (!destinatarioRepository.findById(id)) {
        throw new Error(`Destinatário com ID ${id} não encontrado`);
      }
    }
  }

  criarRota(nome, descricao) {
    this.validarCamposObrigatorios(nome, descricao);
    return rotaRepository.create(nome, descricao);
  }

  listarRotas() {
    return rotaRepository.findAll();
  }

  obterRotaPorId(id) {
    const rota = rotaRepository.findById(id);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rota;
  }

  listarRotasPorStatus(status) {
    this.validarStatusValido(status);
    return rotaRepository.findByStatus(status);
  }

  atualizarRota(id, dados) {
    const rota = rotaRepository.findById(id);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }

    if (dados.status) this.validarStatusValido(dados.status);

    return rotaRepository.update(id, dados);
  }

  deletarRota(id) {
    const rota = rotaRepository.findById(id);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.delete(id);
  }

  desativarRota(id) {
    const rota = rotaRepository.findById(id);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.disable(id);
  }

  adicionarEnderecoARota(rotaId, enderecoId) {
    this.validarEnderecosExistem(enderecoId);
    const rota = rotaRepository.findById(rotaId);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.adicionarEndereco(rotaId, enderecoId);
  }

  removerEnderecodaRota(rotaId, enderecoId) {
    const rota = rotaRepository.findById(rotaId);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.removerEndereco(rotaId, enderecoId);
  }

  adicionarDestinatarioARota(rotaId, destinatarioId) {
    this.validarDestinatariosExistem(destinatarioId);
    const rota = rotaRepository.findById(rotaId);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.adicionarDestinatario(rotaId, destinatarioId);
  }

  removerDestinatariodaRota(rotaId, destinatarioId) {
    const rota = rotaRepository.findById(rotaId);
    if (!rota) {
      throw new Error('Rota não encontrada');
    }
    return rotaRepository.removerDestinatario(rotaId, destinatarioId);
  }

  contarRotas() {
    return rotaRepository.count();
  }
}

module.exports = new RotaService();
