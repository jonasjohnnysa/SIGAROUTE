const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const DestinatarioRepository = require('../../src/repositories/DestinatarioRepository');
const jwt = require('jsonwebtoken');

describe('Destinatario Routes - Integration Tests', () => {
  // Limpar repositório antes de cada teste
  beforeEach(() => {
    DestinatarioRepository.destinatarios = [];
  });

  const getAuthToken = () => {
    return jwt.sign(
      { id: 1, usuario: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };

  describe('POST /api/destinatarios', () => {
    it('deve criar um destinatário com dados válidos', (done) => {
      request(app)
        .post('/api/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua das Flores, 123'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.nome).to.equal('João Silva');
          expect(res.body.data.email).to.equal('joao@example.com');

          done();
        });
    });

    it('deve retornar erro com email inválido', (done) => {
      request(app)
        .post('/api/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'email_invalido',
          telefone: '11987654321',
          endereco: 'Endereço'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });

    it('deve retornar erro sem token de autenticação', (done) => {
      request(app)
        .post('/api/destinatarios')
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Endereço'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /api/destinatarios', () => {
    it('deve retornar lista vazia inicialmente', (done) => {
      request(app)
        .get('/api/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.be.an('array').that.is.empty;

          done();
        });
    });

    it('deve retornar lista com destinatários criados', (done) => {
      // Criar dois destinatários
      request(app)
        .post('/api/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua A'
        })
        .end(() => {
          request(app)
            .post('/api/destinatarios')
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'Maria Santos',
              email: 'maria@example.com',
              telefone: '11987654322',
              endereco: 'Rua B'
            })
            .end(() => {
              // Listar destinatários
              request(app)
                .get('/api/destinatarios')
                .set('Authorization', `Bearer ${getAuthToken()}`)
                .expect(200)
                .end((err, res) => {
                  if (err) return done(err);

                  expect(res.body.data).to.be.an('array');
                  expect(res.body.data.length).to.equal(2);

                  done();
                });
            });
        });
    });
  });

  describe('GET /destinatarios/:id', () => {
    it('deve retornar um destinatário por ID', (done) => {
      // Criar um destinatário
      request(app)
        .post('/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua A'
        })
        .end((err, res) => {
          if (err) return done(err);

          const destinatarioId = res.body.data.id;

          // Obter destinatário
          request(app)
            .get(`/api/destinatarios/${destinatarioId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.id).to.equal(destinatarioId);
              expect(res.body.data.nome).to.equal('João Silva');

              done();
            });
        });
    });

    it('deve retornar erro com ID não encontrado', (done) => {
      request(app)
        .get('/api/destinatarios/id_inexistente')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('PUT /destinatarios/:id', () => {
    it('deve atualizar um destinatário existente', (done) => {
      // Criar um destinatário
      request(app)
        .post('/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua A'
        })
        .end((err, res) => {
          if (err) return done(err);

          const destinatarioId = res.body.data.id;

          // Atualizar destinatário
          request(app)
            .put(`/api/destinatarios/${destinatarioId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'João Silva Atualizado',
              telefone: '11987654999'
            })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.nome).to.equal('João Silva Atualizado');
              expect(res.body.data.telefone).to.equal('11987654999');

              done();
            });
        });
    });
  });

  describe('DELETE /destinatarios/:id', () => {
    it('deve deletar um destinatário existente', (done) => {
      // Criar um destinatário
      request(app)
        .post('/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Rua A'
        })
        .end((err, res) => {
          if (err) return done(err);

          const destinatarioId = res.body.data.id;

          // Deletar destinatário
          request(app)
            .delete(`/api/destinatarios/${destinatarioId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.success).to.be.true;

              done();
            });
        });
    });
  });
});
