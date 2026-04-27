const rotaService = require('../services/RotaService');

class RotaController {
  async criar(req, res, next) {
    try {
      const { nome, descricao } = req.body;
      const rota = rotaService.criarRota(nome, descricao);
      return res.status(201).json({
        success: true,
        data: rota,
        message: 'Rota criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const rotas = rotaService.listarRotas();
      return res.status(200).json({
        success: true,
        data: rotas,
        count: rotas.length,
        message: 'Rotas listadas com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const { id } = req.params;
      const rota = rotaService.obterRotaPorId(id);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Rota obtida com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async listarPorStatus(req, res, next) {
    try {
      const { status } = req.query;
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status é obrigatório'
        });
      }
      const rotas = rotaService.listarRotasPorStatus(status);
      return res.status(200).json({
        success: true,
        data: rotas,
        count: rotas.length,
        message: 'Rotas por status listadas com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const rota = rotaService.atualizarRota(id, req.body);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Rota atualizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      rotaService.deletarRota(id);
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Rota deletada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async desativar(req, res, next) {
    try {
      const { id } = req.params;
      const rota = rotaService.desativarRota(id);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Rota desativada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async adicionarEndereco(req, res, next) {
    try {
      const { rotaId, enderecoId } = req.body;
      if (!rotaId || !enderecoId) {
        return res.status(400).json({
          success: false,
          error: 'rotaId e enderecoId são obrigatórios'
        });
      }
      const rota = rotaService.adicionarEnderecoARota(rotaId, enderecoId);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Endereço adicionado à rota com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async removerEndereco(req, res, next) {
    try {
      const { rotaId, enderecoId } = req.body;
      if (!rotaId || !enderecoId) {
        return res.status(400).json({
          success: false,
          error: 'rotaId e enderecoId são obrigatórios'
        });
      }
      const rota = rotaService.removerEnderecodaRota(rotaId, enderecoId);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Endereço removido da rota com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async adicionarDestinatario(req, res, next) {
    try {
      const { rotaId, destinatarioId } = req.body;
      if (!rotaId || !destinatarioId) {
        return res.status(400).json({
          success: false,
          error: 'rotaId e destinatarioId são obrigatórios'
        });
      }
      const rota = rotaService.adicionarDestinatarioARota(rotaId, destinatarioId);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Destinatário adicionado à rota com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async removerDestinatario(req, res, next) {
    try {
      const { rotaId, destinatarioId } = req.body;
      if (!rotaId || !destinatarioId) {
        return res.status(400).json({
          success: false,
          error: 'rotaId e destinatarioId são obrigatórios'
        });
      }
      const rota = rotaService.removerDestinatariodaRota(rotaId, destinatarioId);
      return res.status(200).json({
        success: true,
        data: rota,
        message: 'Destinatário removido da rota com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RotaController();
