require('../setup');
const { expect } = require('chai');
const AuthService = require('../../src/services/AuthService');

describe('AuthService', () => {
  describe('login', () => {
    it('deve fazer login com credenciais válidas (admin)', () => {
      const resultado = AuthService.login('admin', 'admin@123');

      expect(resultado).to.have.property('token');
      expect(resultado).to.have.property('usuario');
      expect(resultado).to.have.property('expiresIn');
      expect(resultado.usuario.usuario).to.equal('admin');
      expect(resultado.usuario.role).to.equal('admin');
    });

    it('deve fazer login com credenciais válidas (user)', () => {
      const resultado = AuthService.login('jonas.arruda', 'user@123');

      expect(resultado).to.have.property('token');
      expect(resultado.usuario.usuario).to.equal('jonas.arruda');
      expect(resultado.usuario.role).to.equal('user');
    });

    it('deve lançar erro com usuário não encontrado', () => {
      expect(() => {
        AuthService.login('usuario_inexistente', 'senha123');
      }).to.throw('Credenciais inválidas');
    });

    it('deve lançar erro com senha incorreta', () => {
      expect(() => {
        AuthService.login('admin', 'senha_errada');
      }).to.throw('Credenciais inválidas');
    });

    it('deve lançar erro quando usuário ou senha não fornecidos', () => {
      expect(() => {
        AuthService.login('', '');
      }).to.throw('Usuário e senha são obrigatórios');

      expect(() => {
        AuthService.login('admin', '');
      }).to.throw('Usuário e senha são obrigatórios');

      expect(() => {
        AuthService.login('', 'admin@123');
      }).to.throw('Usuário e senha são obrigatórios');
    });
  });

  describe('verificarToken', () => {
    it('deve verificar um token válido gerado pelo login', () => {
      const resultado = AuthService.login('admin', 'admin@123');
      const payload = AuthService.verificarToken(resultado.token);

      expect(payload).to.have.property('id');
      expect(payload).to.have.property('usuario');
      expect(payload.usuario).to.equal('admin');
    });

    it('deve lançar erro com token inválido', () => {
      expect(() => {
        AuthService.verificarToken('token_invalido_xyz');
      }).to.throw('Token inválido');
    });

    it('deve lançar erro com token vazio', () => {
      expect(() => {
        AuthService.verificarToken('');
      }).to.throw('Token inválido');
    });
  });

  describe('listarUsuarios', () => {
    it('deve retornar lista de usuários sem as senhas', () => {
      const usuarios = AuthService.listarUsuarios();

      expect(usuarios).to.be.an('array');
      expect(usuarios.length).to.be.greaterThan(0);

      usuarios.forEach(usuario => {
        expect(usuario).to.have.property('id');
        expect(usuario).to.have.property('usuario');
        expect(usuario).to.have.property('email');
        expect(usuario).to.have.property('role');
        expect(usuario).to.have.property('ativo');
        expect(usuario).to.not.have.property('senhaHash');
      });
    });
  });

  describe('obterUsuarioPorId', () => {
    it('deve obter usuário por ID existente', () => {
      const usuario = AuthService.obterUsuarioPorId(1);

      expect(usuario).to.have.property('id');
      expect(usuario.id).to.equal(1);
      expect(usuario).to.not.have.property('senhaHash');
    });

    it('deve lançar erro com ID não existente', () => {
      expect(() => {
        AuthService.obterUsuarioPorId(999);
      }).to.throw('Usuário não encontrado');
    });
  });
});
