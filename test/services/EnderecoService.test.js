const { expect } = require('chai');
const EnderecoService = require('../../src/services/EnderecoService');
const EnderecoRepository = require('../../src/repositories/EnderecoRepository');

describe('EnderecoService', () => {
  // Limpar repositório antes de cada teste
  beforeEach(() => {
    EnderecoRepository.enderecos = [];
  });

  describe('criarEndereco', () => {
    it('deve criar um endereço com dados válidos', () => {
      const endereco = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      expect(endereco).to.have.property('id');
      expect(endereco.rua).to.equal('Rua das Flores');
      expect(endereco.numero).to.equal('123');
      expect(endereco.cidade).to.equal('São Paulo');
      expect(endereco.estado).to.equal('SP');
      expect(endereco.ativo).to.be.true;
    });

    it('deve lançar erro com CEP inválido', () => {
      expect(() => {
        EnderecoService.criarEndereco(
          'Rua das Flores',
          '123',
          'Centro',
          'São Paulo',
          'SP',
          'CEP_INVALIDO'
        );
      }).to.throw('CEP inválido');
    });

    it('deve lançar erro com estado inválido', () => {
      expect(() => {
        EnderecoService.criarEndereco(
          'Rua das Flores',
          '123',
          'Centro',
          'São Paulo',
          'XX',
          '01234-567'
        );
      }).to.throw('Estado inválido');
    });

    it('deve lançar erro com campos obrigatórios ausentes', () => {
      expect(() => {
        EnderecoService.criarEndereco('', '123', 'Centro', 'São Paulo', 'SP', '01234-567');
      }).to.throw('Todos os campos são obrigatórios');
    });
  });

  describe('listarEnderecos', () => {
    it('deve retornar lista vazia inicialmente', () => {
      const enderecos = EnderecoService.listarEnderecos();
      expect(enderecos).to.be.an('array').that.is.empty;
    });

    it('deve retornar lista com endereços criados', () => {
      EnderecoService.criarEndereco('Rua A', '1', 'Bairro A', 'Cidade A', 'SP', '01234-567');
      EnderecoService.criarEndereco('Rua B', '2', 'Bairro B', 'Cidade B', 'RJ', '01234-567');

      const enderecos = EnderecoService.listarEnderecos();
      expect(enderecos).to.have.lengthOf(2);
    });
  });

  describe('obterEnderecoPorId', () => {
    it('deve retornar endereço existente', () => {
      const criado = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      const encontrado = EnderecoService.obterEnderecoPorId(criado.id);
      expect(encontrado.id).to.equal(criado.id);
      expect(encontrado.rua).to.equal('Rua das Flores');
    });

    it('deve lançar erro com ID não encontrado', () => {
      expect(() => {
        EnderecoService.obterEnderecoPorId('id_invalido');
      }).to.throw('Endereço não encontrado');
    });
  });

  describe('atualizarEndereco', () => {
    it('deve atualizar um endereço existente', () => {
      const criado = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      const atualizado = EnderecoService.atualizarEndereco(criado.id, {
        numero: '456',
        cidade: 'Rio de Janeiro'
      });

      expect(atualizado.numero).to.equal('456');
      expect(atualizado.cidade).to.equal('Rio de Janeiro');
      expect(atualizado.rua).to.equal('Rua das Flores');
    });

    it('deve lançar erro ao atualizar com CEP inválido', () => {
      const criado = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      expect(() => {
        EnderecoService.atualizarEndereco(criado.id, { cep: 'CEP_INVALIDO' });
      }).to.throw('CEP inválido');
    });

    it('deve lançar erro ao atualizar endereço não existente', () => {
      expect(() => {
        EnderecoService.atualizarEndereco('id_invalido', { numero: '999' });
      }).to.throw('Endereço não encontrado');
    });
  });

  describe('deletarEndereco', () => {
    it('deve deletar um endereço existente', () => {
      const criado = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      EnderecoService.deletarEndereco(criado.id);
      const enderecos = EnderecoService.listarEnderecos();

      expect(enderecos).to.have.lengthOf(0);
    });

    it('deve lançar erro ao deletar endereço não existente', () => {
      expect(() => {
        EnderecoService.deletarEndereco('id_invalido');
      }).to.throw('Endereço não encontrado');
    });
  });

  describe('desativarEndereco', () => {
    it('deve desativar um endereço sem deletar', () => {
      const criado = EnderecoService.criarEndereco(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567'
      );

      const desativado = EnderecoService.desativarEndereco(criado.id);
      expect(desativado.ativo).to.be.false;

      const enderecos = EnderecoService.listarEnderecos();
      expect(enderecos).to.have.lengthOf(1);
    });
  });

  describe('listarEnderecosPorCidade', () => {
    it('deve retornar endereços filtrados por cidade', () => {
      EnderecoService.criarEndereco('Rua A', '1', 'Bairro A', 'São Paulo', 'SP', '01234-567');
      EnderecoService.criarEndereco('Rua B', '2', 'Bairro B', 'Rio de Janeiro', 'RJ', '01234-567');
      EnderecoService.criarEndereco('Rua C', '3', 'Bairro C', 'São Paulo', 'SP', '01234-567');

      const enderecosSP = EnderecoService.listarEnderecosPorCidade('São Paulo');
      expect(enderecosSP).to.have.lengthOf(2);
      enderecosSP.forEach(e => expect(e.cidade).to.equal('São Paulo'));
    });
  });

  describe('contarEnderecos', () => {
    it('deve contar o número correto de endereços', () => {
      expect(EnderecoService.contarEnderecos()).to.equal(0);

      EnderecoService.criarEndereco('Rua A', '1', 'Bairro A', 'São Paulo', 'SP', '01234-567');
      EnderecoService.criarEndereco('Rua B', '2', 'Bairro B', 'Rio de Janeiro', 'RJ', '01234-567');

      expect(EnderecoService.contarEnderecos()).to.equal(2);
    });
  });
});
