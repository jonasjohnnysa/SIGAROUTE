const destinatarioRepository = require('../repositories/DestinatarioRepository');

class DestinatarioService {
  validarCamposObrigatorios(nome, email, telefone, endereco) {
    if (!nome || !email || !telefone || !endereco) {
      throw new Error('Nome, email, telefone e endereço são obrigatórios');
    }
  }

  validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  validarTelefone(telefone) {
    const telefoneRegex = /^(\d{10}|\d{11})$/;
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (!telefoneRegex.test(apenasNumeros)) {
      throw new Error('Telefone inválido. Deve conter 10 ou 11 dígitos');
    }
  }

  verificarEmailDuplicado(email, id = null) {
    const existente = destinatarioRepository.findByEmail(email);
    if (existente && existente.id !== id) {
      throw new Error('Email já cadastrado');
    }
  }

  criarDestinatario(nome, email, telefone, endereco) {
    this.validarCamposObrigatorios(nome, email, telefone, endereco);
    this.validarEmail(email);
    this.validarTelefone(telefone);
    this.verificarEmailDuplicado(email);

    return destinatarioRepository.create(nome, email, telefone, endereco);
  }

  listarDestinatarios() {
    return destinatarioRepository.findAll();
  }

  obterDestinatarioPorId(id) {
    const destinatario = destinatarioRepository.findById(id);
    if (!destinatario) {
      throw new Error('Destinatário não encontrado');
    }
    return destinatario;
  }

  obterDestinatarioPorEmail(email) {
    const destinatario = destinatarioRepository.findByEmail(email);
    if (!destinatario) {
      throw new Error('Destinatário não encontrado');
    }
    return destinatario;
  }

  buscarDestinatariosPorNome(nome) {
    if (!nome) {
      throw new Error('Nome é obrigatório para busca');
    }
    return destinatarioRepository.findByNome(nome);
  }

  atualizarDestinatario(id, dados) {
    const destinatario = destinatarioRepository.findById(id);
    if (!destinatario) {
      throw new Error('Destinatário não encontrado');
    }

    if (dados.email) {
      this.validarEmail(dados.email);
      this.verificarEmailDuplicado(dados.email, id);
    }
    if (dados.telefone) {
      this.validarTelefone(dados.telefone);
    }

    return destinatarioRepository.update(id, dados);
  }

  deletarDestinatario(id) {
    const destinatario = destinatarioRepository.findById(id);
    if (!destinatario) {
      throw new Error('Destinatário não encontrado');
    }
    return destinatarioRepository.delete(id);
  }

  desativarDestinatario(id) {
    const destinatario = destinatarioRepository.findById(id);
    if (!destinatario) {
      throw new Error('Destinatário não encontrado');
    }
    return destinatarioRepository.disable(id);
  }

  contarDestinatarios() {
    return destinatarioRepository.count();
  }
}

module.exports = new DestinatarioService();
