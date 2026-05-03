const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const RotaRepository = require('../../src/repositories/RotaRepository');
const EnderecoRepository = require('../../src/repositories/EnderecoRepository');
const DestinatarioRepository = require('../../src/repositories/DestinatarioRepository');
const jwt = require('jsonwebtoken');

describe('Rota Routes - Integration Tests', () => {
  beforeEach(() => {
    RotaRepository.rotas = [];
    EnderecoRepository.enderecos = [];
    DestinatarioRepository.destinatarios = [];
  });

  const getAuthToken = () => {
    return jwt.sign(
      { id: 1, usuario: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };

  describe('POST /api/rotas', () => {
    it('deve criar uma rota com dados válidos', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'Rota Zona Sul',
          descricao: 'Entrega para zona sul'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.nome).to.equal('Rota Zona Sul');
          expect(res.body.data.status).to.equal('ativa');

          done();
        });
    });

    it('deve retornar erro com nome ausente', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          descricao: 'Entrega para zona sul'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });

    it('deve retornar erro sem token', (done) => {
      request(app)
        .post('/api/rotas')
        .send({
          nome: 'Rota Teste',
          descricao: 'Descrição'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /api/rotas', () => {
    it('deve retornar lista vazia inicialmente', (done) => {
      request(app)
        .get('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.be.an('array').that.is.empty;

          done();
        });
    });

    it('deve retornar lista com rotas criadas', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'Rota 1',
          descricao: 'Descrição 1'
        })
        .end(() => {
          request(app)
            .post('/api/rotas')
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'Rota 2',
              descricao: 'Descrição 2'
            })
            .end(() => {
              request(app)
                .get('/api/rotas')
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

  describe('GET /api/rotas/:id', () => {
    it('deve retornar uma rota por ID', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'Rota Teste',
          descricao: 'Descrição'
        })
        .end((err, res) => {
          if (err) return done(err);

          const rotaId = res.body.data.id;

          request(app)
            .get(`/api/rotas/${rotaId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.id).to.equal(rotaId);
              expect(res.body.data.nome).to.equal('Rota Teste');

              done();
            });
        });
    });

    it('deve retornar erro com ID não encontrado', (done) => {
      request(app)
        .get('/api/rotas/id_inexistente')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('PUT /api/rotas/:id', () => {
    it('deve atualizar uma rota existente', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'Rota Original',
          descricao: 'Descrição Original'
        })
        .end((err, res) => {
          if (err) return done(err);

          const rotaId = res.body.data.id;

          request(app)
            .put(`/api/rotas/${rotaId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'Rota Atualizada',
              status: 'pausada'
            })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.nome).to.equal('Rota Atualizada');
              expect(res.body.data.status).to.equal('pausada');

              done();
            });
        });
    });
  });

  describe('DELETE /api/rotas/:id', () => {
    it('deve deletar uma rota existente', (done) => {
      request(app)
        .post('/api/rotas')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'Rota Teste',
          descricao: 'Descrição'
        })
        .end((err, res) => {
          if (err) return done(err);

          const rotaId = res.body.data.id;

          request(app)
            .delete(`/api/rotas/${rotaId}`)
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

  describe('POST /rotas/:id/enderecos/:enderecoId', () => {
    it('deve adicionar um endereço a uma rota', (done) => {
      // Criar endereço
      request(app)
        .post('/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua A',
          numero: '123',
          bairro: 'Bairro A',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        })
        .end((err, res) => {
          if (err) return done(err);

          const enderecoId = res.body.data.id;

          // Criar rota
          request(app)
            .post('/rotas')
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'Rota Teste',
              descricao: 'Descrição'
            })
            .end((err, res) => {
              if (err) return done(err);

              const rotaId = res.body.data.id;

              // Adicionar endereço à rota
              request(app)
                .post(`/api/rotas/${rotaId}/enderecos/${enderecoId}`)
                .set('Authorization', `Bearer ${getAuthToken()}`)
                .expect(200)
                .end((err, res) => {
                  if (err) return done(err);

                  expect(res.body.data.enderecosIds).to.include(enderecoId);

                  done();
                });
            });
        });
    });
  });

  describe('POST /rotas/:id/destinatarios/:destinatarioId', () => {
    it('deve adicionar um destinatário a uma rota', (done) => {
      // Criar destinatário
      request(app)
        .post('/destinatarios')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11987654321',
          endereco: 'Endereço'
        })
        .end((err, res) => {
          if (err) return done(err);

          const destinatarioId = res.body.data.id;

          // Criar rota
          request(app)
            .post('/rotas')
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              nome: 'Rota Teste',
              descricao: 'Descrição'
            })
            .end((err, res) => {
              if (err) return done(err);

              const rotaId = res.body.data.id;

              // Adicionar destinatário à rota
              request(app)
                .post(`/api/rotas/${rotaId}/destinatarios/${destinatarioId}`)
                .set('Authorization', `Bearer ${getAuthToken()}`)
                .expect(200)
                .end((err, res) => {
                  if (err) return done(err);

                  expect(res.body.data.destinatariosIds).to.include(destinatarioId);

                  done();
                });
            });
        });
    });
  });
});
