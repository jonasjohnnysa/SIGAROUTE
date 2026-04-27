const { expect } = require('chai');
const RotaService = require('../../src/services/RotaService');
const EnderecoService = require('../../src/services/EnderecoService');
const DestinatarioService = require('../../src/services/DestinatarioService');
const RotaRepository = require('../../src/repositories/RotaRepository');
const EnderecoRepository = require('../../src/repositories/EnderecoRepository');
const DestinatarioRepository = require('../../src/repositories/DestinatarioRepository');

describe('RotaService', () => {
  beforeEach(() => {
    RotaRepository.rotas = [];
    EnderecoRepository.enderecos = [];
    DestinatarioRepository.destinatarios = [];
  });

  describe('criarRota', () => {
    it('deve criar uma rota com dados válidos', () => {
      const rota = RotaService.criarRota('Rota Zona Sul', 'Entrega para zona sul');

      expect(rota).to.have.property('id');
      expect(rota.nome).to.equal('Rota Zona Sul');
      expect(rota.descricao).to.equal('Entrega para zona sul');
      expect(rota.status).to.equal('ativa');
      expect(rota.enderecosIds).to.be.an('array').that.is.empty;
      expect(rota.destinatariosIds).to.be.an('array').that.is.empty;
    });

    it('deve lançar erro com nome ou descrição ausentes', () => {
      expect(() => {
        RotaService.criarRota('', 'Descrição');
      }).to.throw('Nome e descrição são obrigatórios');

      expect(() => {
        RotaService.criarRota('Nome', '');
      }).to.throw('Nome e descrição são obrigatórios');
    });
  });

  describe('listarRotas', () => {
    it('deve retornar lista vazia inicialmente', () => {
      const rotas = RotaService.listarRotas();
      expect(rotas).to.be.an('array').that.is.empty;
    });

    it('deve retornar lista com rotas criadas', () => {
      RotaService.criarRota('Rota 1', 'Descrição 1');
      RotaService.criarRota('Rota 2', 'Descrição 2');

      const rotas = RotaService.listarRotas();
      expect(rotas).to.have.lengthOf(2);
    });
  });

  describe('obterRotaPorId', () => {
    it('deve retornar rota existente', () => {
      const criada = RotaService.criarRota('Rota Teste', 'Descrição');

      const encontrada = RotaService.obterRotaPorId(criada.id);
      expect(encontrada.id).to.equal(criada.id);
      expect(encontrada.nome).to.equal('Rota Teste');
    });

    it('deve lançar erro com ID não encontrado', () => {
      expect(() => {
        RotaService.obterRotaPorId('id_invalido');
      }).to.throw('Rota não encontrada');
    });
  });

  describe('listarRotasPorStatus', () => {
    it('deve retornar rotas filtradas por status', () => {
      RotaService.criarRota('Rota 1', 'Descrição 1');
      const rota2 = RotaService.criarRota('Rota 2', 'Descrição 2');

      RotaService.desativarRota(rota2.id);

      const rotasAtivas = RotaService.listarRotasPorStatus('ativa');
      expect(rotasAtivas).to.have.lengthOf(1);
      expect(rotasAtivas[0].status).to.equal('ativa');
    });

    it('deve lançar erro com status inválido', () => {
      expect(() => {
        RotaService.listarRotasPorStatus('status_invalido');
      }).to.throw('Status inválido');
    });
  });

  describe('atualizarRota', () => {
    it('deve atualizar uma rota existente', () => {
      const criada = RotaService.criarRota('Rota Original', 'Descrição Original');

      const atualizada = RotaService.atualizarRota(criada.id, {
        nome: 'Rota Atualizada',
        status: 'pausada'
      });

      expect(atualizada.nome).to.equal('Rota Atualizada');
      expect(atualizada.status).to.equal('pausada');
    });
  });

  describe('adicionarEnderecoARota', () => {
    it('deve adicionar um endereço existente à rota', () => {
      const endereco = EnderecoService.criarEndereco(
        'Rua A',
        '1',
        'Bairro A',
        'São Paulo',
        'SP',
        '01234-567'
      );
      const rota = RotaService.criarRota('Rota Teste', 'Descrição');

      const rotaAtualizada = RotaService.adicionarEnderecoARota(rota.id, endereco.id);

      expect(rotaAtualizada.enderecosIds).to.include(endereco.id);
    });

    it('deve lançar erro ao adicionar endereço inexistente', () => {
      const rota = RotaService.criarRota('Rota Teste', 'Descrição');

      expect(() => {
        RotaService.adicionarEnderecoARota(rota.id, 'endereco_inexistente');
      }).to.throw('Endereço com ID endereco_inexistente não encontrado');
    });
  });

  describe('adicionarDestinatarioARota', () => {
    it('deve adicionar um destinatário existente à rota', () => {
      const destinatario = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );
      const rota = RotaService.criarRota('Rota Teste', 'Descrição');

      const rotaAtualizada = RotaService.adicionarDestinatarioARota(rota.id, destinatario.id);

      expect(rotaAtualizada.destinatariosIds).to.include(destinatario.id);
    });

    it('deve lançar erro ao adicionar destinatário inexistente', () => {
      const rota = RotaService.criarRota('Rota Teste', 'Descrição');

      expect(() => {
        RotaService.adicionarDestinatarioARota(rota.id, 'destinatario_inexistente');
      }).to.throw('Destinatário com ID destinatario_inexistente não encontrado');
    });
  });

  describe('deletarRota', () => {
    it('deve deletar uma rota existente', () => {
      const criada = RotaService.criarRota('Rota Teste', 'Descrição');

      RotaService.deletarRota(criada.id);
      const rotas = RotaService.listarRotas();

      expect(rotas).to.have.lengthOf(0);
    });
  });

  describe('desativarRota', () => {
    it('deve desativar uma rota sem deletar', () => {
      const criada = RotaService.criarRota('Rota Teste', 'Descrição');

      const desativada = RotaService.desativarRota(criada.id);
      expect(desativada.status).to.equal('inativa');

      const rotas = RotaService.listarRotas();
      expect(rotas).to.have.lengthOf(1);
    });
  });

  describe('contarRotas', () => {
    it('deve contar o número correto de rotas', () => {
      expect(RotaService.contarRotas()).to.equal(0);

      RotaService.criarRota('Rota 1', 'Descrição 1');
      RotaService.criarRota('Rota 2', 'Descrição 2');

      expect(RotaService.contarRotas()).to.equal(2);
    });
  });
});
