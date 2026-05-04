const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Routes - Integration Tests', () => {
  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas de admin', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          usuario: 'admin',
          senha: 'admin@123'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('usuario');
          expect(res.body.data.usuario.usuario).to.equal('admin');
          expect(res.body.data.usuario.role).to.equal('admin');

          done();
        });
    });

    it('deve fazer login com credenciais válidas de usuário', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          usuario: 'jonas.arruda',
          senha: 'user@123'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('token');
          expect(res.body.data.usuario.role).to.equal('user');

          done();
        });
    });

    it('deve retornar erro com credenciais inválidas', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          usuario: 'admin',
          senha: 'senha_errada'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('error');

          done();
        });
    });

    it('deve retornar erro com usuário não encontrado', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          usuario: 'usuario_inexistente',
          senha: 'senha123'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });

    it('deve retornar erro com campos ausentes', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          usuario: 'admin'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /auth/usuarios', () => {
    it('deve retornar lista de usuários sem as senhas', (done) => {
      request(app)
        .get('/auth/usuarios')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.be.greaterThan(0);

          res.body.data.forEach(usuario => {
            expect(usuario).to.have.property('id');
            expect(usuario).to.have.property('usuario');
            expect(usuario).to.not.have.property('senhaHash');
          });

          done();
        });
    });

    it('deve retornar erro sem token de autenticação', (done) => {
      request(app)
        .get('/auth/usuarios')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });

    it('deve retornar erro com token inválido', (done) => {
      request(app)
        .get('/auth/usuarios')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /auth/perfil', () => {
    it('deve retornar perfil do usuário autenticado', (done) => {
      request(app)
        .get('/auth/perfil')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('usuario');
          expect(res.body.data).to.have.property('role');

          done();
        });
    });

    it('deve retornar erro sem token', (done) => {
      request(app)
        .get('/auth/perfil')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });
});

/**
 * Função auxiliar para gerar um token válido para testes
 * @returns {string} Token JWT válido
 */
function getValidToken() {
  const jwt = require('jsonwebtoken');
  const payload = {
    id: 1,
    usuario: 'admin',
    email: 'admin@sigaroute.com',
    role: 'admin'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}
