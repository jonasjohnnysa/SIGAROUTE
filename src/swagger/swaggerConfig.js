const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIGAROUTE API',
      version: '1.0.0',
      description: 'Sistema de Gerenciamento de Rotas, Endereços e Destinatários',
      contact: {
        name: 'SIGAROUTE',
        email: 'dev@sigaroute.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.sigaroute.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação'
        }
      },
      schemas: {
        // Endereço
        Endereco: {
          type: 'object',
          required: ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'],
          properties: {
            id: { type: 'string', example: '1234567890abc' },
            rua: { type: 'string', example: 'Rua das Flores' },
            numero: { type: 'string', example: '123' },
            bairro: { type: 'string', example: 'Centro' },
            cidade: { type: 'string', example: 'São Paulo' },
            estado: { type: 'string', example: 'SP' },
            cep: { type: 'string', example: '01234-567' },
            ativo: { type: 'boolean', example: true },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        // Rota
        Rota: {
          type: 'object',
          required: ['nome', 'descricao'],
          properties: {
            id: { type: 'string', example: '1234567890abc' },
            nome: { type: 'string', example: 'Rota Zona Sul' },
            descricao: { type: 'string', example: 'Entrega para região da Zona Sul' },
            enderecosIds: { type: 'array', items: { type: 'string' } },
            destinatariosIds: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['ativa', 'inativa', 'pausada'], example: 'ativa' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        // Destinatário
        Destinatario: {
          type: 'object',
          required: ['nome', 'email', 'telefone', 'endereco'],
          properties: {
            id: { type: 'string', example: '1234567890abc' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            telefone: { type: 'string', example: '11987654321' },
            endereco: { type: 'string', example: 'Rua das Flores, 123' },
            ativo: { type: 'boolean', example: true },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        // Login
        LoginRequest: {
          type: 'object',
          required: ['usuario', 'senha'],
          properties: {
            usuario: { type: 'string', example: 'admin' },
            senha: { type: 'string', example: 'admin@123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT Token' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                usuario: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            },
            expiresIn: { type: 'string', example: '24h' }
          }
        },
        // Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
