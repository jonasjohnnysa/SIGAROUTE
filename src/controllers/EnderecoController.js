const enderecoService = require('../services/EnderecoService');

class EnderecoController {
  async criar(req, res, next) {
    try {
      const { rua, numero, bairro, cidade, estado, cep } = req.body;
      const endereco = enderecoService.criarEndereco(rua, numero, bairro, cidade, estado, cep);
      return res.status(201).json({
        success: true,
        data: endereco,
        message: 'Endereço criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const enderecos = enderecoService.listarEnderecos();
      return res.status(200).json({
        success: true,
        data: enderecos,
        count: enderecos.length,
        message: 'Endereços listados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const { id } = req.params;
      const endereco = enderecoService.obterEnderecoPorId(id);
      return res.status(200).json({
        success: true,
        data: endereco,
        message: 'Endereço obtido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async listarPorCidade(req, res, next) {
    try {
      const { cidade } = req.query;
      if (!cidade) {
        return res.status(400).json({
          success: false,
          error: 'Cidade é obrigatória'
        });
      }
      const enderecos = enderecoService.listarEnderecosPorCidade(cidade);
      return res.status(200).json({
        success: true,
        data: enderecos,
        count: enderecos.length,
        message: 'Endereços por cidade listados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const endereco = enderecoService.atualizarEndereco(id, req.body);
      return res.status(200).json({
        success: true,
        data: endereco,
        message: 'Endereço atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      enderecoService.deletarEndereco(id);
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Endereço deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async desativar(req, res, next) {
    try {
      const { id } = req.params;
      const endereco = enderecoService.desativarEndereco(id);
      return res.status(200).json({
        success: true,
        data: endereco,
        message: 'Endereço desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EnderecoController();
