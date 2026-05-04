const authService = require('../services/AuthService');

class AuthController {
  /**
   * Realiza login e retorna JWT token
   */
  async login(req, res, next) {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({
          success: false,
          error: 'Usuário e senha são obrigatórios'
        });
      }

      let resultado;
      try {
        resultado = authService.login(usuario, senha);
      } catch (err) {
        if (err.message === 'Credenciais inválidas') {
          return res.status(401).json({
            success: false,
            error: err.message
          });
        }
        throw err;
      }

      return res.status(200).json({
        success: true,
        data: resultado,
        message: 'Login realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista todos os usuários (apenas para debug/admin)
   */
  async listarUsuarios(req, res, next) {
    try {
      const usuarios = authService.listarUsuarios();
      return res.status(200).json({
        success: true,
        data: usuarios,
        count: usuarios.length,
        message: 'Usuários listados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém informações do usuário logado
   */
  async obterMeuPerfil(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const usuario = authService.obterUsuarioPorId(usuarioId);
      return res.status(200).json({
        success: true,
        data: usuario,
        message: 'Perfil obtido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
