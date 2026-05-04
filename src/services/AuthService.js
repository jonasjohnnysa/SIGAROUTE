const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor() {
    // Usuários pré-definidos em memória
    this.usuarios = [
      {
        id: 1,
        usuario: 'admin',
        email: 'admin@sigaroute.com',
        senhaHash: bcrypt.hashSync('admin@123', 10),
        role: 'admin',
        ativo: true
      },
      {
        id: 2,
        usuario: 'jonas.arruda',
        email: 'jonas@sigaroute.com',
        senhaHash: bcrypt.hashSync('user@123', 10),
        role: 'user',
        ativo: true
      }
    ];
  }

  /**
   * Realiza o login do usuário e retorna um token JWT
   * @param {string} usuario - Nome de usuário
   * @param {string} senha - Senha
   * @returns {Object} - Token JWT e informações do usuário
   */
  login(usuario, senha) {
    if (!usuario || !senha) {
      throw new Error('Usuário e senha são obrigatórios');
    }

    // Buscar usuário
    const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario);
    if (!usuarioEncontrado) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se usuário está ativo
    if (!usuarioEncontrado.ativo) {
      throw new Error('Usuário inativo');
    }

    // Comparar senha
    const senhaValida = bcrypt.compareSync(senha, usuarioEncontrado.senhaHash);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = this.gerarToken({
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      email: usuarioEncontrado.email,
      role: usuarioEncontrado.role
    });

    return {
      token,
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        role: usuarioEncontrado.role
      },
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
  }

  /**
   * Gera um token JWT
   * @param {Object} payload - Dados para incluir no token
   * @returns {string} - Token JWT
   */
  gerarToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    if (!secret) {
      throw new Error('JWT_SECRET não definido. Configure a variável de ambiente JWT_SECRET.');
    }
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verifica e decodifica um token JWT
   * @param {string} token - Token JWT
   * @returns {Object} - Payload decodificado
   */
  verificarToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não definido. Configure a variável de ambiente JWT_SECRET.');
    }
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      }
      throw error;
    }
  }

  /**
   * Lista todos os usuários (sem retornar senhas)
   * @returns {Array} - Array de usuários
   */
  listarUsuarios() {
    return this.usuarios.map(u => ({
      id: u.id,
      usuario: u.usuario,
      email: u.email,
      role: u.role,
      ativo: u.ativo
    }));
  }

  /**
   * Obtém um usuário pelo ID
   * @param {number} id - ID do usuário
   * @returns {Object} - Usuário encontrado
   */
  obterUsuarioPorId(id) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      email: usuario.email,
      role: usuario.role,
      ativo: usuario.ativo
    };
  }
}

module.exports = new AuthService();
