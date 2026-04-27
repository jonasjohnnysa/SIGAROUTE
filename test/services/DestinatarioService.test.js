const { expect } = require('chai');
const DestinatarioService = require('../../src/services/DestinatarioService');
const DestinatarioRepository = require('../../src/repositories/DestinatarioRepository');

describe('DestinatarioService', () => {
  beforeEach(() => {
    DestinatarioRepository.destinatarios = [];
  });

  describe('criarDestinatario', () => {
    it('deve criar um destinatário com dados válidos', () => {
      const destinatario = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Rua das Flores, 123'
      );

      expect(destinatario).to.have.property('id');
      expect(destinatario.nome).to.equal('João Silva');
      expect(destinatario.email).to.equal('joao@example.com');
      expect(destinatario.ativo).to.be.true;
    });

    it('deve lançar erro com email inválido', () => {
      expect(() => {
        DestinatarioService.criarDestinatario(
          'João Silva',
          'email_invalido',
          '11987654321',
          'Endereço'
        );
      }).to.throw('Email inválido');
    });

    it('deve lançar erro com telefone inválido (poucos dígitos)', () => {
      expect(() => {
        DestinatarioService.criarDestinatario(
          'João Silva',
          'joao@example.com',
          '123',
          'Endereço'
        );
      }).to.throw('Telefone inválido');
    });

    it('deve lançar erro com email duplicado', () => {
      DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );

      expect(() => {
        DestinatarioService.criarDestinatario(
          'Maria Silva',
          'joao@example.com',
          '11987654322',
          'Outro Endereço'
        );
      }).to.throw('Email já cadastrado');
    });

    it('deve lançar erro com campos obrigatórios ausentes', () => {
      expect(() => {
        DestinatarioService.criarDestinatario('', 'joao@example.com', '11987654321', 'Endereço');
      }).to.throw('Nome, email, telefone e endereço são obrigatórios');
    });
  });

  describe('listarDestinatarios', () => {
    it('deve retornar lista vazia inicialmente', () => {
      const destinatarios = DestinatarioService.listarDestinatarios();
      expect(destinatarios).to.be.an('array').that.is.empty;
    });

    it('deve retornar lista com destinatários criados', () => {
      DestinatarioService.criarDestinatario('João Silva', 'joao@example.com', '11987654321', 'Endereço 1');
      DestinatarioService.criarDestinatario('Maria Silva', 'maria@example.com', '11987654322', 'Endereço 2');

      const destinatarios = DestinatarioService.listarDestinatarios();
      expect(destinatarios).to.have.lengthOf(2);
    });
  });

  describe('obterDestinatarioPorId', () => {
    it('deve retornar destinatário existente', () => {
      const criado = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );

      const encontrado = DestinatarioService.obterDestinatarioPorId(criado.id);
      expect(encontrado.id).to.equal(criado.id);
      expect(encontrado.nome).to.equal('João Silva');
    });

    it('deve lançar erro com ID não encontrado', () => {
      expect(() => {
        DestinatarioService.obterDestinatarioPorId('id_invalido');
      }).to.throw('Destinatário não encontrado');
    });
  });

  describe('obterDestinatarioPorEmail', () => {
    it('deve retornar destinatário existente por email', () => {
      const criado = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );

      const encontrado = DestinatarioService.obterDestinatarioPorEmail('joao@example.com');
      expect(encontrado.id).to.equal(criado.id);
      expect(encontrado.email).to.equal('joao@example.com');
    });

    it('deve lançar erro com email não encontrado', () => {
      expect(() => {
        DestinatarioService.obterDestinatarioPorEmail('naoexiste@example.com');
      }).to.throw('Destinatário não encontrado');
    });
  });

  describe('buscarDestinatariosPorNome', () => {
    it('deve retornar destinatários com nome contendo o termo de busca', () => {
      DestinatarioService.criarDestinatario('João Silva', 'joao@example.com', '11987654321', 'Endereço 1');
      DestinatarioService.criarDestinatario('Maria Silva', 'maria@example.com', '11987654322', 'Endereço 2');
      DestinatarioService.criarDestinatario('Pedro Santos', 'pedro@example.com', '11987654323', 'Endereço 3');

      const resultados = DestinatarioService.buscarDestinatariosPorNome('Silva');
      expect(resultados).to.have.lengthOf(2);
      resultados.forEach(r => expect(r.nome).to.include('Silva'));
    });

    it('deve buscar sem distinção de maiúsculas/minúsculas', () => {
      DestinatarioService.criarDestinatario('João Silva', 'joao@example.com', '11987654321', 'Endereço');

      const resultados = DestinatarioService.buscarDestinatariosPorNome('SILVA');
      expect(resultados).to.have.lengthOf(1);
    });
  });

  describe('atualizarDestinatario', () => {
    it('deve atualizar um destinatário existente', () => {
      const criado = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço Antigo'
      );

      const atualizado = DestinatarioService.atualizarDestinatario(criado.id, {
        endereco: 'Endereço Novo',
        telefone: '11987654999'
      });

      expect(atualizado.endereco).to.equal('Endereço Novo');
      expect(atualizado.telefone).to.equal('11987654999');
      expect(atualizado.nome).to.equal('João Silva');
    });

    it('deve validar novo email ao atualizar', () => {
      DestinatarioService.criarDestinatario('João Silva', 'joao@example.com', '11987654321', 'Endereço 1');
      const destinatario2 = DestinatarioService.criarDestinatario('Maria Silva', 'maria@example.com', '11987654322', 'Endereço 2');

      expect(() => {
        DestinatarioService.atualizarDestinatario(destinatario2.id, {
          email: 'joao@example.com'
        });
      }).to.throw('Email já cadastrado');
    });
  });

  describe('deletarDestinatario', () => {
    it('deve deletar um destinatário existente', () => {
      const criado = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );

      DestinatarioService.deletarDestinatario(criado.id);
      const destinatarios = DestinatarioService.listarDestinatarios();

      expect(destinatarios).to.have.lengthOf(0);
    });
  });

  describe('desativarDestinatario', () => {
    it('deve desativar um destinatário sem deletar', () => {
      const criado = DestinatarioService.criarDestinatario(
        'João Silva',
        'joao@example.com',
        '11987654321',
        'Endereço'
      );

      const desativado = DestinatarioService.desativarDestinatario(criado.id);
      expect(desativado.ativo).to.be.false;

      const destinatarios = DestinatarioService.listarDestinatarios();
      expect(destinatarios).to.have.lengthOf(1);
    });
  });

  describe('contarDestinatarios', () => {
    it('deve contar o número correto de destinatários', () => {
      expect(DestinatarioService.contarDestinatarios()).to.equal(0);

      DestinatarioService.criarDestinatario('João Silva', 'joao@example.com', '11987654321', 'Endereço 1');
      DestinatarioService.criarDestinatario('Maria Silva', 'maria@example.com', '11987654322', 'Endereço 2');

      expect(DestinatarioService.contarDestinatarios()).to.equal(2);
    });
  });
});
