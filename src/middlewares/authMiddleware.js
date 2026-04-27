const authService = require('../services/AuthService');

/**
 * Middleware para autenticação JWT
 * Valida o token e adiciona as informações do usuário ao req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    // Verificar se segue padrão "Bearer <token>"
    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    const token = partes[1];

    // Verificar e decodificar token
    const payload = authService.verificarToken(token);
    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message || 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de admin
 */
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Permissão de admin necessária'
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
