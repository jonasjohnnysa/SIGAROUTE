const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const EnderecoRepository = require('../../src/repositories/EnderecoRepository');
const jwt = require('jsonwebtoken');

describe('Endereco Routes - Integration Tests', () => {
  beforeEach(() => {
    EnderecoRepository.enderecos = [];
  });

  const getAuthToken = () => {
    return jwt.sign(
      { id: 1, usuario: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };

  describe('POST /api/enderecos', () => {
    it('deve criar um endereço com dados válidos', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.rua).to.equal('Rua das Flores');
          expect(res.body.data.numero).to.equal('123');

          done();
        });
    });

    it('deve retornar erro com CEP inválido', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: 'CEP_INVALIDO'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });

    it('deve retornar erro com estado inválido', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'XX',
          cep: '01234-567'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /api/enderecos', () => {
    it('deve retornar lista de endereços', (done) => {
      request(app)
        .get('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.be.an('array');

          done();
        });
    });

    it('deve retornar erro sem token', (done) => {
      request(app)
        .get('/api/enderecos')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('GET /api/enderecos/:id', () => {
    it('deve retornar um endereço por ID', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        })
        .end((err, res) => {
          if (err) return done(err);

          const enderecoId = res.body.data.id;

          request(app)
            .get(`/api/enderecos/${enderecoId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.id).to.equal(enderecoId);

              done();
            });
        });
    });

    it('deve retornar erro com ID não encontrado', (done) => {
      request(app)
        .get('/api/enderecos/id_inexistente')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.false;

          done();
        });
    });
  });

  describe('PUT /api/enderecos/:id', () => {
    it('deve atualizar um endereço existente', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        })
        .end((err, res) => {
          if (err) return done(err);

          const enderecoId = res.body.data.id;

          request(app)
            .put(`/api/enderecos/${enderecoId}`)
            .set('Authorization', `Bearer ${getAuthToken()}`)
            .send({
              numero: '456',
              cidade: 'Rio de Janeiro'
            })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body.data.numero).to.equal('456');
              expect(res.body.data.cidade).to.equal('Rio de Janeiro');

              done();
            });
        });
    });
  });

  describe('DELETE /api/enderecos/:id', () => {
    it('deve deletar um endereço existente', (done) => {
      request(app)
        .post('/api/enderecos')
        .set('Authorization', `Bearer ${getAuthToken()}`)
        .send({
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        })
        .end((err, res) => {
          if (err) return done(err);

          const enderecoId = res.body.data.id;

          request(app)
            .delete(`/api/enderecos/${enderecoId}`)
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
