const enderecoRepository = require('../repositories/EnderecoRepository');

class EnderecoService {
  validarCamposObrigatorios(rua, numero, bairro, cidade, estado, cep) {
    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
      throw new Error('Todos os campos são obrigatórios');
    }
  }

  validarCEP(cep) {
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) {
      throw new Error('CEP inválido. Formato: XXXXX-XXX ou XXXXXXXX');
    }
  }

  validarEstado(estado) {
    const estadosValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    if (!estadosValidos.includes(estado.toUpperCase())) {
      throw new Error('Estado inválido');
    }
  }

  criarEndereco(rua, numero, bairro, cidade, estado, cep) {
    this.validarCamposObrigatorios(rua, numero, bairro, cidade, estado, cep);
    this.validarCEP(cep);
    this.validarEstado(estado);

    return enderecoRepository.create(rua, numero, bairro, cidade, estado.toUpperCase(), cep);
  }

  listarEnderecos() {
    return enderecoRepository.findAll();
  }

  obterEnderecoPorId(id) {
    const endereco = enderecoRepository.findById(id);
    if (!endereco) {
      throw new Error('Endereço não encontrado');
    }
    return endereco;
  }

  listarEnderecosPorCidade(cidade) {
    return enderecoRepository.findByCity(cidade);
  }

  atualizarEndereco(id, dados) {
    const endereco = enderecoRepository.findById(id);
    if (!endereco) {
      throw new Error('Endereço não encontrado');
    }

    if (dados.cep) this.validarCEP(dados.cep);
    if (dados.estado) this.validarEstado(dados.estado);

    return enderecoRepository.update(id, dados);
  }

  deletarEndereco(id) {
    const endereco = enderecoRepository.findById(id);
    if (!endereco) {
      throw new Error('Endereço não encontrado');
    }
    return enderecoRepository.delete(id);
  }

  desativarEndereco(id) {
    const endereco = enderecoRepository.findById(id);
    if (!endereco) {
      throw new Error('Endereço não encontrado');
    }
    return enderecoRepository.disable(id);
  }

  contarEnderecos() {
    return enderecoRepository.count();
  }
}

module.exports = new EnderecoService();
