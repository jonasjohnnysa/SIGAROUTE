const destinatarioService = require('../services/DestinatarioService');

class DestinatarioController {
  async criar(req, res, next) {
    try {
      const { nome, email, telefone, endereco } = req.body;
      const destinatario = destinatarioService.criarDestinatario(nome, email, telefone, endereco);
      return res.status(201).json({
        success: true,
        data: destinatario,
        message: 'Destinatário criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const destinatarios = destinatarioService.listarDestinatarios();
      return res.status(200).json({
        success: true,
        data: destinatarios,
        count: destinatarios.length,
        message: 'Destinatários listados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const { id } = req.params;
      const destinatario = destinatarioService.obterDestinatarioPorId(id);
      return res.status(200).json({
        success: true,
        data: destinatario,
        message: 'Destinatário obtido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async obterPorEmail(req, res, next) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email é obrigatório'
        });
      }
      const destinatario = destinatarioService.obterDestinatarioPorEmail(email);
      return res.status(200).json({
        success: true,
        data: destinatario,
        message: 'Destinatário obtido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPorNome(req, res, next) {
    try {
      const { nome } = req.query;
      if (!nome) {
        return res.status(400).json({
          success: false,
          error: 'Nome é obrigatório para busca'
        });
      }
      const destinatarios = destinatarioService.buscarDestinatariosPorNome(nome);
      return res.status(200).json({
        success: true,
        data: destinatarios,
        count: destinatarios.length,
        message: 'Destinatários encontrados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const destinatario = destinatarioService.atualizarDestinatario(id, req.body);
      return res.status(200).json({
        success: true,
        data: destinatario,
        message: 'Destinatário atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      destinatarioService.deletarDestinatario(id);
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Destinatário deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async desativar(req, res, next) {
    try {
      const { id } = req.params;
      const destinatario = destinatarioService.desativarDestinatario(id);
      return res.status(200).json({
        success: true,
        data: destinatario,
        message: 'Destinatário desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DestinatarioController();
